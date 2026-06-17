<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { toast } from "$lib/components/ui/toast";

  interface CustomProduct {
    barcodeOrId: string;
    name: string;
    brand: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    saturatedFat: number;
    sugars: number;
    fiber: number;
    salt: number;
    servingSize: number;
  }

  let {
    prefilledBarcode = "",
    onProductLogged
  }: {
    prefilledBarcode: string;
    onProductLogged: (product: CustomProduct, amount: number) => void;
  } = $props();

  let customProduct = $state<CustomProduct>({
    barcodeOrId: "",
    name: "",
    brand: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    saturatedFat: 0,
    sugars: 0,
    fiber: 0,
    salt: 0,
    servingSize: 100
  });
  let customLoggedAmount = $state(100);

  $effect(() => {
    if (prefilledBarcode) {
      customProduct.barcodeOrId = prefilledBarcode;
    }
  });

  function handleSubmit() {
    if (!customProduct.name.trim()) {
      toast.error("Food name is required");
      return;
    }
    
    // Generate unique ID if barcode is empty
    const finalProduct = { ...customProduct };
    if (!finalProduct.barcodeOrId.trim()) {
      finalProduct.barcodeOrId = "custom-" + Date.now();
    }

    onProductLogged(finalProduct, customLoggedAmount);

    // Reset local state
    customProduct = {
      barcodeOrId: "",
      name: "",
      brand: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      saturatedFat: 0,
      sugars: 0,
      fiber: 0,
      salt: 0,
      servingSize: 100
    };
    customLoggedAmount = 100;
  }
</script>

<div class="space-y-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1.5">
      <Label for="custom-barcode" class="text-xs font-bold text-muted-foreground">Barcode (Optional)</Label>
      <Input 
        id="custom-barcode"
        type="text" 
        placeholder="e.g. 6411401015050" 
        bind:value={customProduct.barcodeOrId} 
        class="rounded-2xl font-semibold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-brand" class="text-xs font-bold text-muted-foreground">Brand / Manufacturer</Label>
      <Input 
        id="custom-brand"
        type="text" 
        placeholder="e.g. Fazer" 
        bind:value={customProduct.brand} 
        class="rounded-2xl font-semibold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
      />
    </div>
  </div>

  <div class="space-y-1.5">
    <Label for="custom-name" class="text-xs font-bold text-muted-foreground">Food Name</Label>
    <Input 
      id="custom-name"
      type="text" 
      placeholder="e.g. Blue Chocolate Bar" 
      bind:value={customProduct.name} 
      class="rounded-2xl font-bold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
    />
  </div>

  <!-- Custom macros grid (expanded) -->
  <div class="grid grid-cols-4 gap-3 bg-muted/10 p-3 rounded-2xl border border-border/20">
    <div class="space-y-1.5">
      <Label for="custom-calories" class="text-[10px] font-bold text-muted-foreground">Kcal /100g</Label>
      <Input 
        id="custom-calories"
        type="number" 
        bind:value={customProduct.calories} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-protein" class="text-[10px] font-bold text-muted-foreground">Protein /100g</Label>
      <Input 
        id="custom-protein"
        type="number" 
        step="0.1"
        bind:value={customProduct.protein} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-carbs" class="text-[10px] font-bold text-muted-foreground">Carbs /100g</Label>
      <Input 
        id="custom-carbs"
        type="number" 
        step="0.1"
        bind:value={customProduct.carbs} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-fat" class="text-[10px] font-bold text-muted-foreground">Fat /100g</Label>
      <Input 
        id="custom-fat"
        type="number" 
        step="0.1"
        bind:value={customProduct.fat} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>

    <!-- Extra row for Sugars, Saturated Fat, Fiber, Salt -->
    <div class="space-y-1.5">
      <Label for="custom-sugars" class="text-[10px] font-bold text-muted-foreground">Sugar /100g</Label>
      <Input 
        id="custom-sugars"
        type="number" 
        step="0.1"
        bind:value={customProduct.sugars} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-saturatedFat" class="text-[10px] font-bold text-muted-foreground">Sat Fat /100g</Label>
      <Input 
        id="custom-saturatedFat"
        type="number" 
        step="0.1"
        bind:value={customProduct.saturatedFat} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-fiber" class="text-[10px] font-bold text-muted-foreground">Fiber /100g</Label>
      <Input 
        id="custom-fiber"
        type="number" 
        step="0.1"
        bind:value={customProduct.fiber} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-salt" class="text-[10px] font-bold text-muted-foreground">Salt /100g</Label>
      <Input 
        id="custom-salt"
        type="number" 
        step="0.01"
        bind:value={customProduct.salt} 
        class="rounded-xl text-center font-bold h-9 bg-card border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="0"
      />
    </div>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1.5">
      <Label for="custom-serving" class="text-xs font-bold text-muted-foreground">Serving Size (g)</Label>
      <Input 
        id="custom-serving"
        type="number" 
        bind:value={customProduct.servingSize} 
        class="rounded-2xl font-semibold bg-muted/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        min="1"
      />
    </div>
    <div class="space-y-1.5">
      <Label for="custom-amount" class="text-xs font-bold text-muted-foreground">Weight Eaten (g)</Label>
      <Input 
        id="custom-amount"
        type="number" 
        bind:value={customLoggedAmount} 
        class="rounded-2xl font-bold bg-muted/50 border-border/40 text-primary focus-visible:ring-1 focus-visible:ring-primary"
        min="1"
      />
    </div>
  </div>

  <Button 
    onclick={handleSubmit}
    class="w-full rounded-2xl font-bold mt-2"
  >
    Save Product & Log
  </Button>
</div>
