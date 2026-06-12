<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-sonner";
  import { themeState } from "$lib/theme.svelte";

  onMount(() => {
    themeState.init();

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
<Toaster
  theme={themeState.current}
  position="top-center"
  class="toaster group"
  toastOptions={{
    classes: {
      toast:
        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:border",
      description: "group-[.toast]:text-muted-foreground",
      actionButton:
        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
      cancelButton:
        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      error:
        "group-[.toast]:bg-destructive/10 group-[.toast]:!text-destructive group-[.toast]:border-destructive/20 [&_*]:!text-destructive",
      success:
        "group-[.toast]:bg-emerald-500/10 group-[.toast]:!text-emerald-500 group-[.toast]:border-emerald-500/20 [&_*]:!text-emerald-500",
    },
  }}
/>
{@render children()}
