<script>
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import {
    startRegistration,
    startAuthentication,
  } from "@simplewebauthn/browser";

  let username = $state("");
  let message = $state("");

  const ORIGIN = "https://monada.foundation";
  // const ORIGIN = "http://localhost:3000";

  async function registerPasskey() {
    message = "Requesting registration...";
    try {
      const startRes = await fetch(`${ORIGIN}/api/auth/register/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!startRes.ok) {
        const err = await startRes.json();
        message = `Start failed: ${err.error}`;
        return;
      }

      const options = await startRes.json();

      // FIX: Unwrap options.publicKey here
      const cred = await startRegistration({
        optionsJSON: options.publicKey,
      });

      const finishRes = await fetch(`${ORIGIN}/api/auth/register/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, cred }),
      });

      if (finishRes.ok) {
        message = "Passkey registered successfully! You can now log in.";
      } else {
        const err = await finishRes.json();
        message = `Registration failed: ${err.error}`;
      }
    } catch (err) {
      console.error(err);
      message = "Registration was canceled or failed.";
    }
  }

  async function loginPasskey() {
    message = "Requesting login...";
    try {
      const startRes = await fetch(`${ORIGIN}/api/auth/login/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!startRes.ok) {
        const err = await startRes.json();
        message = `Cannot login: ${err.error || "User not found"}`;
        return;
      }

      const options = await startRes.json();

      // FIX: Unwrap options.publicKey here as well
      const cred = await startAuthentication({
        optionsJSON: options.publicKey,
      });

      const finishRes = await fetch(`${ORIGIN}/api/auth/login/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, cred }),
      });

      if (finishRes.ok) {
        const { access_token } = await finishRes.json();
        localStorage.setItem("jwt", access_token);
        message = "Logged in successfully!";
      } else {
        message = "Invalid passkey or server verification failed.";
      }
    } catch (err) {
      console.error(err);
      message = "Login was canceled or failed.";
    }
  }
</script>

<main>
  <h2>Passkey Auth</h2>

  <div>
    <label for="username">Email / Username:</label>
    <!-- Adding autocomplete="username webauthn" helps calm down Chrome extensions -->
    <Input
      id="username"
      type="text"
      bind:value={username}
      placeholder="alice@example.com"
      autocomplete="username webauthn"
    />
  </div>

  <div style="margin-top: 1rem;">
    <Button onclick={registerPasskey}>Create Passkey</Button>
    <Button onclick={loginPasskey}>Login with Passkey</Button>
  </div>

  {#if message}
    <p style="margin-top: 1rem; font-weight: bold;">{message}</p>
  {/if}
</main>
