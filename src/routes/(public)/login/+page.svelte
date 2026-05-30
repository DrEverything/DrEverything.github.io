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
    apps: Record<string, string[]>;
  }

  let requestedApps = $state<
    Record<string, { enabled: boolean; role: string }>
  >({
    health: { enabled: true, role: "patient" },
    business: { enabled: false, role: "member" },
    meridian: { enabled: false, role: "planner" },
  });

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

      const apps: Record<string, string[]> = {};
      for (const [appId, config] of Object.entries(requestedApps)) {
        if (config.enabled) {
          apps[appId] = [config.role];
        }
      }

      const user: UserMetadata = await post("register/finish", {
        email,
        cred,
        apps,
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

          <div class="border-t border-border/80 pt-4 space-y-3">
            <div class="flex items-center justify-between pb-1">
              <h3
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Requested Apps
              </h3>
              <span
                class="text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full font-medium"
                >Select apps to unlock</span
              >
            </div>

            <div class="space-y-3">
              <!-- Health App Card -->
              <Label
                class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
              >
                <Checkbox
                  id="toggle-2"
                  bind:checked={requestedApps.health.enabled}
                  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-transform duration-300 {requestedApps
                        .health.enabled
                        ? 'scale-110'
                        : ''}"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-foreground">
                        Health
                      </div>
                      <div class="text-[11px] text-muted-foreground">
                        Labs and body monitoring
                      </div>
                    </div>
                  </div>
                </div></Label
              >

              <!-- Business App Card -->

              <Label
                class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
              >
                <Checkbox
                  id="toggle-2"
                  bind:checked={requestedApps.business.enabled}
                  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-transform duration-300 {requestedApps
                        .business.enabled
                        ? 'scale-110'
                        : ''}"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 21l18 0" />
                        <path d="M9 8l1 0" />
                        <path d="M9 12l1 0" />
                        <path d="M9 16l1 0" />
                        <path d="M14 8l1 0" />
                        <path d="M14 12l1 0" />
                        <path d="M14 16l1 0" />
                        <path
                          d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-foreground">
                        Business
                      </div>
                      <div class="text-[11px] text-muted-foreground">
                        Operating plans & calculations
                      </div>
                    </div>
                  </div>
                </div></Label
              >

              <!-- Meridian App Card -->
              <Label
                class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
              >
                <Checkbox
                  id="toggle-2"
                  bind:checked={requestedApps.meridian.enabled}
                  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500 transition-transform duration-300 {requestedApps
                        .meridian.enabled
                        ? 'scale-110'
                        : ''}"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M12 3l0 3" />
                        <path d="M12 18l0 3" />
                        <path d="M3 12l3 0" />
                        <path d="M18 12l3 0" />
                        <path d="M12 12l3 -3" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-foreground">
                        Meridian
                      </div>
                      <div class="text-[11px] text-muted-foreground">
                        Planning & Ideas mapping
                      </div>
                    </div>
                  </div>
                </div></Label
              >
            </div>
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
