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
  import { toast } from "svelte-sonner";
  import { fade } from "svelte/transition";
  import { Fingerprint } from "@lucide/svelte";

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
      toast.error(error);
    } finally {
      loading = false;
    }
  }

  async function register() {
    if (!email.trim()) {
      error = "Enter your email.";
      toast.error(error);
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
      } else {
        error =
          err.name === "NotAllowedError"
            ? "Passkey creation cancelled."
            : err.message || "Registration failed.";
      }
      toast.error(error);
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
  <div class="relative flex min-h-svh items-center justify-center p-4 overflow-hidden bg-radial from-background via-background/95 to-background/80">
    <!-- Glowing background elements -->
    <!-- <div class="absolute -top-[30%] left-[10%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div> -->
    <!-- <div class="absolute -bottom-[30%] right-[10%] h-[70%] w-[70%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div> -->

    <div class="relative w-full max-w-sm">
      <!-- Outer glow border -->
      <!-- <div class="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/30 via-blue-500/20 to-indigo-500/30 opacity-60 blur-sm"></div> -->

      <Card.Root class="relative w-full max-w-sm overflow-hidden border border-border/40 bg-card/70 backdrop-blur-md shadow-2xl rounded-xl">
        <div class="grid grid-cols-1 grid-rows-1">
          {#if view === "home"}
            <div in:fade={{ delay: 150, duration: 150 }} out:fade={{ duration: 150 }} class="col-start-1 row-start-1 flex flex-col">
              <Card.Header class="text-center pb-2">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-indigo-500/5 border border-primary/20 text-primary shadow-sm">
                  <Fingerprint class="h-6 w-6 stroke-[1.5]" />
                </div>
                <Card.Title
                  class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1"
                  >Monada</Card.Title
                >
                <Card.Description class="text-xs text-muted-foreground/90 font-medium"
                  >Sign in securely using your device passkey.</Card.Description
                >
              </Card.Header>
              <Card.Content class="space-y-4 pt-2">
                <Button
                  class="w-full h-11 text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
                  onclick={login}
                  disabled={loading}
                >
                  {#if loading}
                    <Spinner class="mr-2 size-4 animate-spin" />
                    Waiting for passkey…
                  {:else}
                    Sign in with passkey
                  {/if}
                </Button>
                <Button
                  class="w-full h-11 text-sm font-semibold transition-all duration-300 active:scale-[0.98] border-border/80 hover:bg-muted"
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
            </div>
          {:else}
            <div in:fade={{ delay: 150, duration: 150 }} out:fade={{ duration: 150 }} class="col-start-1 row-start-1 flex flex-col">
              <Card.Header class="text-center pb-3">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-indigo-500/5 border border-primary/20 text-primary shadow-sm">
                  <Fingerprint class="h-6 w-6 stroke-[1.5]" />
                </div>
                <Card.Title
                  class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1"
                  >Create account</Card.Title
                >
                <Card.Description class="text-xs text-muted-foreground/90 font-medium">
                  Register a secure passkey to unlock your super app.
                </Card.Description>
              </Card.Header>
              <Card.Content class="space-y-5">
                <div class="space-y-2">
                  <Label
                    for="email"
                    class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80"
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
                    class="h-10 border-border/80 bg-background/40"
                  />
                </div>

                <Button
                  class="w-full h-11 text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
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
            </div>
          {/if}
        </div>
      </Card.Root>
    </div>
  </div>
{/if}
