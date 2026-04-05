<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Spinner } from "$lib/components/ui/spinner";

  let { children } = $props();
  let status = $state<"pending" | "yes" | "no">("pending");

  onMount(async () => {
    const res = await fetch("/api/auth/check", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      status = "yes";
    } else {
      goto("/login");
    }
  });
</script>

{#if status === "pending"}
  <div class="flex min-h-svh items-center justify-center">
    <Spinner class="size-8" />
  </div>
{:else}
  {@render children()}
{/if}
