<script lang="ts">
  import Menubar from "./menubar.svelte";
  import { Spinner } from "$lib/components/ui/spinner";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

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
  <!-- pt-2 acts as your initial 'top-2' offset so the menu sits 8px from the top -->
  <div class="pt-2">
    <!-- Changed 'fixed' to 'sticky'. Added 'bg-background' so text doesn't overlap on scroll -->
    <header class="sticky top-2 z-50 flex items-center px-4">
      <Menubar />
    </header>

    <!-- pt-2 creates exactly 2 units (8px) of space below the menu -->
    <main class="mx-4 pt-2">
      <Tooltip.Provider delayDuration={0}>
        {@render children()}
      </Tooltip.Provider>
    </main>
  </div>
{/if}
