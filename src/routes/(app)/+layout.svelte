<script lang="ts">
  import Menubar from "./menubar.svelte";
  import { Spinner } from "$lib/components/ui/spinner";

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
  <div class="[--mh:2.5rem] [--mt:0.5rem] [--top:3.5rem]">
    <header
      class="fixed top-(--mt) inset-x-0 z-50 h-(--mh)
                   flex items-center px-4 gap-3"
    >
      <Menubar />
    </header>
    <main class="pt-(--top)">
      {@render children()}
    </main>
  </div>
{/if}
