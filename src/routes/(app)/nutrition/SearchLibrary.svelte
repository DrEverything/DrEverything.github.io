<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import SearchIcon from "@tabler/icons-svelte/icons/search";

  let {
    onProductSelected
  }: {
    onProductSelected: (product: any, amount: number) => void;
  } = $props();

  let searchQuery = $state("");
  let searchResults = $state<any[]>([]);
  let searchLoading = $state(false);
  let selectedSearchProduct = $state<any | null>(null);
  let searchLoggedAmount = $state(100);

  $effect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        searchResults = [];
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  });

  async function performSearch() {
    searchLoading = true;
    try {
      const res = await fetch("/api/nutrition/product/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        searchResults = await res.json();
      }
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      searchLoading = false;
    }
  }

  function handleLog() {
    if (!selectedSearchProduct) return;
    onProductSelected(selectedSearchProduct, searchLoggedAmount);
    selectedSearchProduct = null;
    searchQuery = "";
    searchResults = [];
  }
</script>

<div class="space-y-4">
  <div class="relative">
    <SearchIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input 
      type="text" 
      placeholder="Search food by name or brand..." 
      bind:value={searchQuery}
      class="pl-10 rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
    />
  </div>

  <!-- Search Results -->
  <div class="max-h-48 overflow-y-auto space-y-2 border border-border/10 rounded-2xl p-2 bg-muted/10">
    {#if searchLoading}
      <div class="flex justify-center py-6">
        <Spinner class="size-5 animate-spin text-primary" />
      </div>
    {:else}
      {#if searchResults.length === 0}
        <p class="text-xs text-muted-foreground text-center py-6">
          {searchQuery.trim().length < 2 ? "Type at least 2 characters to search your product library..." : "No matching food products found."}
        </p>
      {:else}
        {#each searchResults as prod}
          <button 
            onclick={() => { selectedSearchProduct = prod; searchLoggedAmount = prod.servingSize || 100; }}
            class="w-full text-left p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all flex justify-between items-center {selectedSearchProduct?.barcodeOrId === prod.barcodeOrId ? 'bg-primary/10 border-primary/20' : 'bg-card'}"
          >
            <div class="min-w-0 flex-1 text-left mr-4">
              <h4 class="text-xs font-bold text-foreground leading-tight truncate">{prod.name}</h4>
              <p class="text-[10px] text-muted-foreground truncate">{prod.brand || "Custom"} • {prod.calories} kcal/100g</p>
            </div>
            <span class="text-[10px] text-muted-foreground font-mono shrink-0">P: {prod.protein}g C: {prod.carbs}g F: {prod.fat}g</span>
          </button>
        {/each}
      {/if}
    {/if}
  </div>

  <!-- Log amount if product selected -->
  {#if selectedSearchProduct}
    <div class="p-4 bg-muted/20 border border-border/40 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
      <div class="flex justify-between items-center text-xs">
        <span class="font-bold">Logging: {selectedSearchProduct.name}</span>
        <span class="font-mono font-semibold text-muted-foreground">({Math.round((searchLoggedAmount / 100) * selectedSearchProduct.calories)} kcal)</span>
      </div>
      
      <div class="space-y-1.5">
        <Label for="search-weight" class="text-[11px] font-bold text-muted-foreground">Weight Consumed (grams)</Label>
        <Input 
          id="search-weight"
          type="number" 
          bind:value={searchLoggedAmount} 
          class="rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
          min="1"
        />
      </div>
      
      <Button 
        onclick={handleLog}
        class="w-full rounded-2xl font-bold"
      >
        Log to Daily Food Log
      </Button>
    </div>
  {/if}
</div>
