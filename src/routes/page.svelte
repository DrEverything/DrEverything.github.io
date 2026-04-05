<script lang="ts">
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { onMount } from "svelte";

  let auth = $state<"pending" | "yes" | "no">("pending");

  onMount(async () => {
    const res = await fetch(`/api/auth/check`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      auth = "yes";
    } else {
      auth = "no";
    }
  });
</script>

{#if auth === "pending"}
  <div class="flex min-h-svh items-center justify-center">
    <Spinner class="size-8" />
  </div>
{:else if auth === "yes"}
  <Dashboard />
{:else}
  <Login />
{/if}

