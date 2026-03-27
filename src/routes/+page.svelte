<script lang="ts">
  import Healthcare from "./Healthcare.svelte";
  import Food from "./Food.svelte";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";

  let auth = $state<"pending" | "yes" | "no">("pending");

  onMount(async () => {
    const res = await fetch(`/api/data/something`, {
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
  <!-- nothing, or a spinner -->
{:else if auth === "yes"}
  <Dashboard />
{:else}
  <Login />
{/if}
