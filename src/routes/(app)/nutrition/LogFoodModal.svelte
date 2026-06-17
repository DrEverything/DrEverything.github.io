<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import BarcodeScanner from "./BarcodeScanner.svelte";
  import SearchLibrary from "./SearchLibrary.svelte";
  import CustomFoodForm from "./CustomFoodForm.svelte";
  
  import BarcodeIcon from "@tabler/icons-svelte/icons/barcode";
  import SearchIcon from "@tabler/icons-svelte/icons/search";
  import PlusIcon from "@tabler/icons-svelte/icons/plus";

  let {
    open = $bindable(false),
    onLog
  }: {
    open: boolean;
    onLog: (barcodeOrId: string, amount: number, productDetails: any) => Promise<void>;
  } = $props();

  let activeTab = $state("barcode");
  let prefilledBarcode = $state("");

  $effect(() => {
    if (open) {
      activeTab = "barcode";
      prefilledBarcode = "";
    }
  });

  async function handleProductLogged(product: any, amount: number) {
    await onLog(product.barcodeOrId, amount, product);
    open = false; // Close modal on success
  }

  function handleNavigateToCustom(code: string) {
    prefilledBarcode = code;
    activeTab = "custom"; // Navigate to custom tab
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content 
    class="w-[calc(100%-2rem)] sm:w-full max-w-xl sm:max-w-xl rounded-3xl p-6 fixed top-24 left-1/2 max-h-[85vh] overflow-y-auto overflow-x-hidden"
    style="transform: translate(-50%, 0) !important; translate: none !important;"
  >
    <Dialog.Header>
      <Dialog.Title class="text-lg font-black tracking-tight">Log Food Intake</Dialog.Title>
      <Dialog.Description class="text-xs text-muted-foreground">Scan product barcodes or search database</Dialog.Description>
    </Dialog.Header>

    <Tabs.Root value={activeTab} onValueChange={(val) => activeTab = val} class="w-full flex flex-col items-center">
      <Tabs.List class="grid grid-cols-3 sm:inline-flex bg-muted/40 p-1.5 rounded-2xl border border-border/20 h-auto gap-1 w-full sm:w-auto">
        <Tabs.Trigger 
          value="barcode" 
          class="flex items-center justify-center gap-1.5 py-2 px-3 sm:px-6 rounded-xl text-[11px] sm:text-xs font-bold transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
        >
          <BarcodeIcon class="size-3.5 shrink-0" />
          <span class="hidden sm:inline">Scan Barcode</span>
          <span class="sm:hidden">Scan</span>
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="search" 
          class="flex items-center justify-center gap-1.5 py-2 px-3 sm:px-6 rounded-xl text-[11px] sm:text-xs font-bold transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
        >
          <SearchIcon class="size-3.5 shrink-0" />
          <span class="hidden sm:inline">Search Library</span>
          <span class="sm:hidden">Search</span>
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="custom" 
          class="flex items-center justify-center gap-1.5 py-2 px-3 sm:px-6 rounded-xl text-[11px] sm:text-xs font-bold transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
        >
          <PlusIcon class="size-3.5 shrink-0" />
          <span class="hidden sm:inline">Custom Food</span>
          <span class="sm:hidden">Custom</span>
        </Tabs.Trigger>
      </Tabs.List>

      <div class="mt-4 w-full flex flex-col justify-start">
        <Tabs.Content value="barcode" class="outline-none">
          {#if activeTab === "barcode"}
            <BarcodeScanner 
              onProductFound={handleProductLogged}
              onNavigateToCustom={handleNavigateToCustom}
            />
          {/if}
        </Tabs.Content>

        <Tabs.Content value="search" class="outline-none">
          {#if activeTab === "search"}
            <SearchLibrary 
              onProductSelected={handleProductLogged}
            />
          {/if}
        </Tabs.Content>

        <Tabs.Content value="custom" class="outline-none">
          {#if activeTab === "custom"}
            <CustomFoodForm 
              {prefilledBarcode}
              onProductLogged={handleProductLogged}
            />
          {/if}
        </Tabs.Content>
      </div>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
