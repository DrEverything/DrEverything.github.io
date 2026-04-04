<script lang="ts">
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";

  type View = "home" | "register";
  let view = $state<View>("home");
  let email = $state("");
  let error = $state("");
  let loading = $state(false);

  async function post(path: string, body?: unknown) {
    const res = await fetch(`/api/auth/${path}`, {
      method: "POST",
      credentials: "include",
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw Object.assign(new Error(json.error ?? res.statusText), {
        status: res.status,
      });
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function login() {
    loading = true;
    error = "";
    try {
      const { challenge_id, publicKey } = await post("login/start");
      const cred = await startAuthentication({ optionsJSON: publicKey });
      await post("login/finish", { challenge_id, cred });
      location.reload();
    } catch (err: any) {
      error =
        err.name === "NotAllowedError"
          ? "Cancelled."
          : err.message || "Something went wrong.";
    } finally {
      loading = false;
    }
  }

  async function register() {
    if (!email.trim()) {
      error = "Enter your email.";
      return;
    }
    loading = true;
    error = "";
    try {
      const options = await post("register/start", { email });
      const cred = await startRegistration({ optionsJSON: options.publicKey });
      await post("register/finish", { email, cred });
      goto("/dashboard");
    } catch (err: any) {
      if (err.status === 409) {
        error = "Account already exists.";
        return;
      }
      error =
        err.name === "NotAllowedError"
          ? "Passkey creation cancelled."
          : err.message || "Something went wrong.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex min-h-svh items-center justify-center p-4">
  <Card.Root class="w-full max-w-sm">
    {#if view === "home"}
      <!-- <Card.Header class="text-center"> -->
      <!--   <Card.Title class="text-2xl">Welcome to Monada</Card.Title> -->
      <!--   <Card.Description>Sign in or create a passkey account.</Card.Description -->
      <!--   > -->
      <!-- </Card.Header> -->
      <Card.Content class="space-y-3">
        {#if error}<p class="text-center text-sm text-destructive">
            {error}
          </p>{/if}
        <Button class="w-full" onclick={login} disabled={loading}>
          {loading ? "Waiting for passkey…" : "Sign in with passkey"}
        </Button>
        <Button
          class="w-full"
          variant="outline"
          onclick={() => {
            view = "register";
            error = "";
          }}
        >
          Create account
        </Button>
      </Card.Content>
    {:else}
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">Create account</Card.Title>
        <Card.Description
          >Enter your email to register a passkey.</Card.Description
        >
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
        {#if error}<p class="text-center text-sm text-destructive">
            {error}
          </p>{/if}
        <Button class="w-full" onclick={register} disabled={loading}>
          {loading ? "Creating passkey…" : "Continue"}
        </Button>
        <p class="text-center text-sm text-muted-foreground">
          Already have a passkey?
          <button
            class="underline underline-offset-4 hover:text-primary"
            onclick={() => {
              view = "home";
              error = "";
            }}>Sign in</button
          >
        </p>
      </Card.Content>
    {/if}
  </Card.Root>
</div>
