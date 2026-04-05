<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Spinner } from "$lib/components/ui/spinner";

  let { children } = $props();
  let status = $state<-1 | 0 | 1>(0);

  onMount(async () => {
    const res = await fetch("/api/auth/check", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      status = 1;
    } else {
      goto("/login");
    }
  });
</script>

  {#if status === 0}
  <div class="flex min-h-svh items-center justify-center">
    <Spinner class="size-8" />
  </div>
{:else}
  {@render children()}
{/if}
