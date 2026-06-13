<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";
  import { toast } from "$lib/components/ui/toast";
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
        "group-[.toast]:bg-success/10 group-[.toast]:!text-success group-[.toast]:border-success/20 [&_*]:!text-success",
      warning:
        "group-[.toast]:bg-warning/10 group-[.toast]:!text-warning group-[.toast]:border-warning/20 [&_*]:!text-warning",
    },
  }}
/>
{@render children()}
