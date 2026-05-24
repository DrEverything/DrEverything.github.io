<script lang="ts">
  import type { CapexEntry, OpexEntry } from "$lib/types";

  let capex = $state(new Map<string, CapexEntry>());
  let opex = $state(new Map<string, OpexEntry>());

  capex.set("something", "value");
  capex.set("a", "a");
  capex.set("b", "b");

  function insert_capex() {}

  function insert_opex() {}
</script>

<!-- <button onclick={() => capex.set("")}>Add capex</button> -->
<!-- <button onclick={() => capex.set("")}>Add opex</button> -->

{#each capex as [key, value]}
  <p><strong>{key}:</strong> {value}</p>
{/each}
