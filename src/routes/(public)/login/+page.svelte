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
  import { onMount } from "svelte";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  // -1: Not authenticated, 0: Checking authentication, 1: Authenticated
  let status = $state<-1 | 0 | 1>(0);
  let view = $state<"home" | "register">("home");
  let email = $state("");
  let error = $state("");
  let loading = $state(false);

  interface UserMetadata {
    user_id: string;
    email: string;
  }

  function route(user?: UserMetadata) {
    if (user) {
      localStorage.setItem("monada_user", JSON.stringify(user));
    }
    const currentApp = localStorage.getItem("currentApp");
    goto(currentApp ?? "/health");
  }

  function clearSession() {
    localStorage.removeItem("monada_user");
    localStorage.removeItem("currentApp");
    status = -1;
  }

  onMount(async () => {
    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const user: UserMetadata = await res.json();
        route(user);
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  });

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
      const user: UserMetadata = await post("login/finish", {
        challenge_id,
        cred,
      });

      route(user);
    } catch (err: any) {
      error =
        err.name === "NotAllowedError"
          ? "Verification cancelled."
          : err.message || "Authentication failed.";
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

      const user: UserMetadata = await post("register/finish", {
        email,
        cred,
      });

      route(user);
    } catch (err: any) {
      if (err.status === 409) {
        error = "An account with this email already exists.";
        return;
      }
      error =
        err.name === "NotAllowedError"
          ? "Passkey creation cancelled."
          : err.message || "Registration failed.";
    } finally {
      loading = false;
    }
  }
</script>

{#if status === 0}
  <div class="flex min-h-svh items-center justify-center">
    <Spinner class="size-8 animate-spin text-muted-foreground" />
  </div>
{:else}
  <div class="flex min-h-svh items-center justify-center p-4">
    <Card.Root class="w-full max-w-sm">
      {#if view === "home"}
        <Card.Header class="text-center">
          <Card.Title class="text-2xl font-semibold tracking-tight"
            >Monada</Card.Title
          >
          <Card.Description
            >Sign in securely using your device passkey.</Card.Description
          >
        </Card.Header>
        <Card.Content class="space-y-3">
          {#if error}
            <p class="text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          {/if}
          <Button class="w-full" onclick={login} disabled={loading}>
            {#if loading}
              <Spinner class="mr-2 size-4 animate-spin" />
              Waiting for passkey…
            {:else}
              Sign in with passkey
            {/if}
          </Button>
          <Button
            class="w-full"
            variant="outline"
            disabled={loading}
            onclick={() => {
              view = "register";
              error = "";
            }}
          >
            Create account
          </Button>
        </Card.Content>
      {:else}
        <Card.Header class="text-center pb-2">
          <Card.Title
            class="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent"
            >Create account</Card.Title
          >
          <Card.Description>
            Register a secure passkey to unlock your super app.
          </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-5">
          <div class="space-y-2">
            <Label
              for="email"
              class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >Email Address</Label
            >
            <Input
              id="email"
              type="email"
              bind:value={email}
              placeholder="name@domain.com"
              autocomplete="email"
              disabled={loading}
              onkeydown={(e) => e.key === "Enter" && register()}
              class="h-10"
            />
          </div>

          {#if error}
            <p
              class="text-center text-xs font-semibold text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20"
              role="alert"
            >
              {error}
            </p>
          {/if}

          <Button
            class="w-full h-11 text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-[0.98]"
            onclick={register}
            disabled={loading}
          >
            {#if loading}
              <Spinner class="mr-2 size-4 animate-spin" />
              Creating passkey…
            {:else}
              Create Account with Passkey
            {/if}
          </Button>

          <p class="text-center text-xs text-muted-foreground">
            Already have a passkey?
            <button
              class="underline underline-offset-4 text-primary font-semibold hover:text-primary/80 transition-colors"
              onclick={() => {
                view = "home";
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
{/if}
