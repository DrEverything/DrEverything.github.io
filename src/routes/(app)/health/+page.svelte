<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Dashboard from "./Dashboard.svelte";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  import { onMount } from "svelte";
</script>

<div class="flex flex-col gap-4 p-6 items-center">
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button {...props}>Hover to see Graph</Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content
      class="w-[500px] p-0 bg-card! text-card-foreground! border! border-border! shadow-xl! rounded-xl! overflow-hidden"
      arrowClasses="bg-card! border-r! border-b! border-border!"
    >
      <Dashboard class="border-0! shadow-none! bg-transparent! py-0!" />
    </Tooltip.Content>
  </Tooltip.Root>
</div>
