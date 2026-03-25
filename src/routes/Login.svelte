<script lang="ts">
  import { onMount } from "svelte";
  import {
    startRegistration,
    startAuthentication,
    browserSupportsWebAuthnAutofill,
  } from "@simplewebauthn/browser";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";

  type Step = "idle" | "register";
  let step = $state<Step>("idle");
  let email = $state("");
  let error = $state("");
  let loading = $state(false);
  let showRegister = $state(false);

  onMount(async () => {
    if (!(await browserSupportsWebAuthnAutofill())) {
      console.log("autofill not supported");
      showRegister = true;
      return;
    }

    console.log("autofill supported, arming...");

    try {
      const res = await fetch("/api/auth/login/start", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return;

      const { challenge_id, publicKey } = await res.json();

      const autofillTimeout = setTimeout(() => {
        showRegister = true;
      }, 3000);

      const cred = await startAuthentication({
        optionsJSON: publicKey,
        useBrowserAutofill: true,
      });

      clearTimeout(autofillTimeout);

      const finish = await fetch("/api/auth/login/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id, cred }),
        credentials: "include",
      });

      if (finish.ok) goto("/dashboard");
      else showRegister = true; // login failed, show register
    } catch (e) {
      console.log("conditional UI caught:", e);
      showRegister = true; // no passkey found, show register
      // No passkey available — user stays on idle, can register
    }
  });

  async function login() {
    loading = true;
    error = "";
    try {
      const res = await fetch("/api/auth/login/start", {
        method: "POST",
        credentials: "include",
      });
      const { challenge_id, publicKey } = await res.json();
      const cred = await startAuthentication({ optionsJSON: publicKey });
      const finish = await fetch("/api/auth/login/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id, cred }),
        credentials: "include",
      });
      if (finish.ok) goto("/dashboard");
      else error = "Passkey verification failed.";
    } catch (err: any) {
      error =
        err.name === "NotAllowedError" ? "Canceled." : "Something went wrong.";
    } finally {
      loading = false;
    }
  }

  // ── Registration ────────────────────────────────────────────────────────

  async function register() {
    if (!email.trim()) {
      error = "Enter your email.";
      return;
    }
    loading = true;
    error = "";
    try {
      const startRes = await fetch("/api/auth/register/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (startRes.status === 409) {
        error = "An account with that email already exists.";
        return;
      }
      if (!startRes.ok) {
        error = "Could not start registration.";
        return;
      }

      const options = await startRes.json();
      const cred = await startRegistration({ optionsJSON: options.publicKey });

      const finishRes = await fetch("/api/auth/register/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cred }),
        credentials: "include",
      });

      if (finishRes.ok) goto("/dashboard");
      else error = "Registration failed. Please try again.";
    } catch (err: any) {
      error =
        err.name === "NotAllowedError"
          ? "Passkey creation was canceled."
          : "Something went wrong.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex min-h-svh items-center justify-center p-4">
  <Card.Root class="w-full max-w-sm">
    {#if step === "idle"}
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">Welcome</Card.Title>
        <Card.Description>
          Sign in with your passkey should start automatically!
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <!--
          This hidden input is what the browser attaches the passkey
          autofill picker to. It must exist in the DOM on mount.
        -->
        <input
          type="text"
          autocomplete="username webauthn"
          style="position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;"
          tabindex="-1"
          aria-hidden="true"
        />
        {#if error}
          <p class="text-center text-sm text-destructive">{error}</p>
        {/if}
        {#if showRegister}
          <div class="space-y-2">
            <Button
              class="w-full"
              onclick={() => {
                step = "register";
                error = "";
              }}
            >
              Create account
            </Button>
            <Button class="w-full" variant="outline" onclick={login}>
              Sign in with passkey
            </Button>
          </div>
        {/if}
      </Card.Content>
    {:else if step === "register"}
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">Create account</Card.Title>
        <Card.Description>
          Enter your email to create a passkey account.
        </Card.Description>
      </Card.Header>
      <Card.Content class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            bind:value={email}
            placeholder="alice@example.com"
            autocomplete="email"
            disabled={loading}
            onkeydown={(e) => e.key === "Enter" && register()}
          />
        </div>
        {#if error}
          <p class="text-sm text-destructive text-center">{error}</p>
        {/if}
        <Button class="w-full" onclick={register} disabled={loading}>
          {loading ? "Creating passkey…" : "Continue"}
        </Button>
        <p class="text-center text-sm text-muted-foreground">
          Already have a passkey?
          <button
            class="underline underline-offset-4 hover:text-primary"
            onclick={() => {
              step = "idle";
              error = "";
            }}
          >
            Sign in
          </button>
        </p>
      </Card.Content>
    {/if}
  </Card.Root>
</div>
