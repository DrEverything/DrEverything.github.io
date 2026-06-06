<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  onMount(() => {
    function handleInvalid(e: Event) {
      e.preventDefault();

      const input = e.target as HTMLInputElement;
      toast.error(input.validationMessage); // browser already writes a nice message
    }

    document.addEventListener("invalid", handleInvalid, true); // true = capture phase
    return () => document.removeEventListener("invalid", handleInvalid, true);
  });

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
