<script lang="ts">
  import { fade } from "svelte/transition";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import PlusIcon from "@tabler/icons-svelte/icons/plus";
  import TrashIcon from "@tabler/icons-svelte/icons/trash";
  import CheckIcon from "@tabler/icons-svelte/icons/check";
  import XIcon from "@tabler/icons-svelte/icons/x";
  import AppleIcon from "@tabler/icons-svelte/icons/apple";

  let {
    logs = [],
    onRemove,
    onUpdate,
    onAddClick
  }: {
    logs: any[];
    onRemove: (logId: string) => Promise<void>;
    onUpdate: (logId: string, amount: number) => Promise<void>;
    onAddClick: () => void;
  } = $props();

  let editingLogId = $state<string | null>(null);
  let editingAmount = $state<number>(100);

  function startEditing(item: any) {
    editingLogId = item.logId;
    editingAmount = item.amount;
  }

  async function handleSaveEdit() {
    if (!editingLogId) return;
    await onUpdate(editingLogId, editingAmount);
    editingLogId = null;
  }
</script>

<div class="bg-card/30 backdrop-blur-md border border-border/30 rounded-3xl overflow-hidden shadow-lg">
  <div class="flex items-center justify-between p-4 sm:p-5 bg-card/50 border-b border-border/30">
    <div class="flex items-baseline gap-3">
      <h2 class="text-base sm:text-lg font-black tracking-tight">Daily Food Log</h2>
      <span class="text-xs text-muted-foreground font-bold font-mono">{logs.length} item{logs.length === 1 ? "" : "s"} logged</span>
    </div>
    
    <Button 
      onclick={onAddClick}
      size="sm"
      class="rounded-xl shadow-sm font-bold text-xs"
    >
      <PlusIcon class="size-4 mr-1.5" />
      Add Food
    </Button>
  </div>

  <div class="p-4 sm:p-5 divide-y divide-border/20">
    {#if logs.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <AppleIcon class="size-10 text-muted-foreground/30 mb-3" />
        <h4 class="font-bold text-base text-foreground/80">No foods logged today</h4>
        <p class="text-xs text-muted-foreground max-w-xs mt-1">Keep track of your calories, macros, and micro nutrition numbers by scanning a grocery item or entering custom records.</p>
      </div>
    {:else}
      {#each logs as item (item.logId)}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 first:pt-0 last:pb-0">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-black text-foreground leading-tight">{item.product.name}</h4>
              {#if item.product.brand}
                <span class="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                  {item.product.brand}
                </span>
              {/if}
            </div>
            <!-- Expanded Nutritional info labels -->
            <div class="flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              <span class="font-bold text-foreground/80">{item.amount}g</span>
              <span>•</span>
              <span>P: {((item.amount / 100) * item.product.protein).toFixed(1)}g</span>
              <span>C: {((item.amount / 100) * item.product.carbs).toFixed(1)}g</span>
              <span class="text-[11px] font-mono text-muted-foreground/80">(sugars: {((item.amount / 100) * (item.product.sugars || 0)).toFixed(1)}g)</span>
              <span>•</span>
              <span>F: {((item.amount / 100) * item.product.fat).toFixed(1)}g</span>
              <span class="text-[11px] font-mono text-muted-foreground/80">(sat: {((item.amount / 100) * (item.product.saturatedFat || 0)).toFixed(1)}g)</span>
              <span>•</span>
              <span>Fiber: {((item.amount / 100) * (item.product.fiber || 0)).toFixed(1)}g</span>
              <span>•</span>
              <span>Salt: {((item.amount / 100) * (item.product.salt || 0)).toFixed(2)}g</span>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-4">
            <span class="text-sm font-black font-mono">{Math.round((item.amount / 100) * item.product.calories)} kcal</span>
            
            <div class="flex items-center gap-1.5">
              <!-- Edit Amount -->
              {#if editingLogId === item.logId}
                <div class="flex items-center gap-1 bg-muted p-1 rounded-xl" transition:fade={{ duration: 150 }}>
                  <Input 
                    type="number" 
                    bind:value={editingAmount} 
                    class="w-16 h-7 bg-card text-foreground px-2 py-1 rounded-lg text-xs font-bold text-center border-0 focus-visible:ring-1 focus-visible:ring-primary"
                    min="1"
                  />
                  <Button 
                    variant="ghost"
                    size="icon"
                    onclick={handleSaveEdit} 
                    class="size-7 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                    title="Save"
                  >
                    <CheckIcon class="size-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onclick={() => editingLogId = null} 
                    class="size-7 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                    title="Cancel"
                  >
                    <XIcon class="size-4" />
                  </Button>
                </div>
              {:else}
                <Button 
                  variant="ghost"
                  size="sm"
                  onclick={() => startEditing(item)}
                  class="h-7 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                >
                  Edit
                </Button>
              {/if}

              <!-- Delete -->
              <Button 
                variant="ghost"
                size="icon"
                onclick={() => onRemove(item.logId)} 
                class="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                title="Delete log"
              >
                <TrashIcon class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
