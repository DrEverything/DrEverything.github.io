<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  interface Targets {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    saturatedFat: number;
    sugars: number;
    fiber: number;
    salt: number;
  }

  let {
    open = $bindable(false),
    targets,
    onSave
  }: {
    open: boolean;
    targets: Targets;
    onSave: (newTargets: Targets) => void;
  } = $props();

  let tempTargets = $state<Targets>({
    calories: 2000,
    protein: 130,
    carbs: 220,
    fat: 65,
    saturatedFat: 22,
    sugars: 50,
    fiber: 30,
    salt: 5
  });

  $effect(() => {
    if (open && targets) {
      tempTargets = {
        calories: targets.calories,
        protein: targets.protein,
        carbs: targets.carbs,
        fat: targets.fat,
        saturatedFat: targets.saturatedFat || 22,
        sugars: targets.sugars || 50,
        fiber: targets.fiber || 30,
        salt: targets.salt || 5
      };
    }
  });

  function handleSave() {
    onSave({ ...tempTargets });
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-lg rounded-3xl p-6">
    <Dialog.Header>
      <Dialog.Title class="text-lg font-black tracking-tight">Configure Targets</Dialog.Title>
      <Dialog.Description class="text-xs text-muted-foreground">Set your daily nutritional target goals.</Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-4 py-2">
      <!-- Row 1 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="set-calories" class="text-xs font-bold text-muted-foreground">Daily Calories (kcal)</Label>
          <Input 
            id="set-calories"
            type="number" 
            bind:value={tempTargets.calories} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="set-protein" class="text-xs font-bold text-muted-foreground">Protein (g)</Label>
          <Input 
            id="set-protein"
            type="number" 
            bind:value={tempTargets.protein} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <!-- Row 2 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="set-carbs" class="text-xs font-bold text-muted-foreground">Carbs (g)</Label>
          <Input 
            id="set-carbs"
            type="number" 
            bind:value={tempTargets.carbs} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="set-sugars" class="text-xs font-bold text-muted-foreground">Sugars (g)</Label>
          <Input 
            id="set-sugars"
            type="number" 
            bind:value={tempTargets.sugars} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <!-- Row 3 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="set-fat" class="text-xs font-bold text-muted-foreground">Fat (g)</Label>
          <Input 
            id="set-fat"
            type="number" 
            bind:value={tempTargets.fat} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="set-saturatedFat" class="text-xs font-bold text-muted-foreground">Saturated Fat (g)</Label>
          <Input 
            id="set-saturatedFat"
            type="number" 
            bind:value={tempTargets.saturatedFat} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <!-- Row 4 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="set-fiber" class="text-xs font-bold text-muted-foreground">Fiber (g)</Label>
          <Input 
            id="set-fiber"
            type="number" 
            bind:value={tempTargets.fiber} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="set-salt" class="text-xs font-bold text-muted-foreground">Salt (g)</Label>
          <Input 
            id="set-salt"
            type="number" 
            step="0.1"
            bind:value={tempTargets.salt} 
            class="rounded-xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
    </div>

    <Dialog.Footer class="flex sm:justify-between gap-3 pt-2">
      <Button 
        variant="secondary"
        onclick={() => open = false}
        class="flex-1 rounded-2xl font-bold"
      >
        Cancel
      </Button>
      <Button 
        onclick={handleSave}
        class="flex-1 rounded-2xl font-bold"
      >
        Save Settings
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
