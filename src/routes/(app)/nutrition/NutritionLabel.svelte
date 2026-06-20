<script lang="ts">
  interface NutritionData {
    protein: number;
    carbs: number;
    fat: number;
    saturatedFat: number;
    sugars: number;
    fiber: number;
    salt: number;
  }

  let { totals, targets }: { totals: NutritionData; targets: NutritionData } = $props();
</script>

<div class="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-border/40 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
  <!-- <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/20 pb-2">Detailed Daily Intake Label</h3> -->
  
  <div class="grid grid-cols-1 gap-x-6 gap-y-3.5 text-sm">
    <!-- Protein -->
    <div class="flex justify-between items-center py-1 border-b border-border/10">
      <span class="font-bold text-foreground">Protein</span>
      <span class="font-mono text-muted-foreground"><strong class="text-foreground">{totals.protein.toFixed(1)}g</strong> / {targets.protein}g</span>
    </div>
    
    <!-- Carbohydrates -->
    <div class="flex flex-col py-1 border-b border-border/10">
      <div class="flex justify-between items-center">
        <span class="font-bold text-foreground">Carbohydrates</span>
        <span class="font-mono text-muted-foreground"><strong class="text-foreground">{totals.carbs.toFixed(1)}g</strong> / {targets.carbs}g</span>
      </div>
      <div class="flex justify-between items-center pl-4 text-xs text-muted-foreground mt-0.5">
        <span>of which sugars</span>
        <span class="font-mono"><strong>{totals.sugars.toFixed(1)}g</strong> / {targets.sugars}g</span>
      </div>
    </div>

    <!-- Fats -->
    <div class="flex flex-col py-1 border-b border-border/10">
      <div class="flex justify-between items-center">
        <span class="font-bold text-foreground">Fat</span>
        <span class="font-mono text-muted-foreground"><strong class="text-foreground">{totals.fat.toFixed(1)}g</strong> / {targets.fat}g</span>
      </div>
      <div class="flex justify-between items-center pl-4 text-xs text-muted-foreground mt-0.5">
        <span>of which saturated fat</span>
        <span class="font-mono"><strong>{totals.saturatedFat.toFixed(1)}g</strong> / {targets.saturatedFat}g</span>
      </div>
    </div>

    <!-- Fiber -->
    <div class="flex justify-between items-center py-1 border-b border-border/10">
      <span class="font-bold text-foreground">Dietary Fiber</span>
      <span class="font-mono text-muted-foreground"><strong class="text-foreground">{totals.fiber.toFixed(1)}g</strong> / {targets.fiber}g</span>
    </div>

    <!-- Salt -->
    <div class="flex justify-between items-center py-1 border-b border-border/10">
      <span class="font-bold text-foreground">Salt</span>
      <span class="font-mono text-muted-foreground"><strong class="text-foreground">{totals.salt.toFixed(2)}g</strong> / {targets.salt}g</span>
    </div>
  </div>
</div>
