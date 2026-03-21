<script lang="ts">
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { goto } from "$app/navigation";

  // const ORIGIN = "https://monada.foundation";
  const ORIGIN = "http://localhost:3000";

  // Modes: "login" | "register"
  let mode = $state("login");
  let username = $state("");
  let message = $state("");
  let error = $state("");
  let loading = $state(false);

  async function loginPasskey() {
    if (!username.trim()) {
      error = "Please enter your email or username.";
      return;
    }
    loading = true;
    error = "";
    message = "";
    try {
      const startRes = await fetch(`${ORIGIN}/api/auth/login/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        error = err.error ?? "No passkey found for that account.";
        return;
      }

      const options = await startRes.json();
      const cred = await startAuthentication({
        optionsJSON: options.publicKey,
      });

      const finishRes = await fetch(`${ORIGIN}/api/auth/login/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // JWT is set as an HttpOnly cookie by the server — we never touch it in JS
        body: JSON.stringify({ username, cred }),
        credentials: "include",
      });
      if (finishRes.ok) {
        message = "Signed in!";
        // TODO: redirect, e.g. goto("/dashboard")

        goto("/dashboard");
      } else {
        error = "Passkey verification failed.";
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        error = "Sign-in was canceled.";
      } else {
        console.error(err);
        error = "Something went wrong. Please try again.";
      }
    } finally {
      loading = false;
    }
  }

  async function registerPasskey() {
    if (!username.trim()) {
      error = "Please enter an email or username.";
      return;
    }
    loading = true;
    error = "";
    message = "";
    try {
      const startRes = await fetch(`${ORIGIN}/api/auth/register/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        error = err.error ?? "Could not start registration.";
        return;
      }

      const options = await startRes.json();
      const cred = await startRegistration({ optionsJSON: options.publicKey });

      const finishRes = await fetch(`${ORIGIN}/api/auth/register/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, cred }),
        credentials: "include",
      });
      if (finishRes.ok) {
        message = "Passkey created! You can now sign in.";
        mode = "login";
      } else {
        const err = await finishRes.json().catch(() => ({}));
        error = err.error ?? "Registration failed.";
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        error = "Passkey creation was canceled.";
      } else {
        console.error(err);
        error = "Something went wrong. Please try again.";
      }
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      mode === "login" ? loginPasskey() : registerPasskey();
    }
  }
</script>

<div class="flex min-h-svh items-center justify-center p-4">
  <Card.Root class="w-full max-w-sm">
    <Card.Header class="text-center">
      <Card.Title class="text-2xl">
        {mode === "login" ? "Welcome back" : "Create account"}
      </Card.Title>
      <Card.Description>
        {mode === "login"
          ? "Enter your email to sign in with your passkey."
          : "Enter an email to create your passkey."}
      </Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
      <div class="space-y-2">
        <Label for="username">Email or username</Label>
        <!--
          autocomplete="username webauthn" lets the browser surface passkey
          suggestions in its autofill dropdown as the user types.
        -->
        <Input
          id="username"
          type="text"
          bind:value={username}
          placeholder="alice@example.com"
          autocomplete="username webauthn"
          disabled={loading}
          onkeydown={handleKeydown}
        />
      </div>

      {#if mode === "login"}
        <Button class="w-full" onclick={loginPasskey} disabled={loading}>
          {loading ? "Signing in…" : "Sign in with passkey"}
        </Button>

        <Separator />

        <p class="text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <button
            class="underline underline-offset-4 hover:text-primary"
            onclick={() => {
              mode = "register";
              error = "";
              message = "";
            }}
          >
            Create one
          </button>
        </p>
      {:else}
        <Button class="w-full" onclick={registerPasskey} disabled={loading}>
          {loading ? "Creating passkey…" : "Create passkey"}
        </Button>

        <Separator />

        <p class="text-center text-sm text-muted-foreground">
          Already have a passkey?{" "}
          <button
            class="underline underline-offset-4 hover:text-primary"
            onclick={() => {
              mode = "login";
              error = "";
              message = "";
            }}
          >
            Sign in
          </button>
        </p>
      {/if}

      {#if message}
        <p class="text-center text-sm font-medium text-green-600">{message}</p>
      {/if}
      {#if error}
        <p class="text-center text-sm font-medium text-destructive">{error}</p>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
