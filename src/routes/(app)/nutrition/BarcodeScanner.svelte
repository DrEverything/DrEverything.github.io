<script lang="ts">
  import { tick, onMount, onDestroy } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { toast } from "$lib/components/ui/toast";
  import BarcodeIcon from "@tabler/icons-svelte/icons/barcode";

  let {
    onProductFound,
    onNavigateToCustom,
  }: {
    onProductFound: (product: any, amount: number) => void;
    onNavigateToCustom: (code: string) => void;
  } = $props();

  let barcodeInput = $state("");
  let lookupLoading = $state(false);
  let foundProduct = $state<any | null>(null);
  let barcodeLoggedAmount = $state(100);

  // Camera scanner state
  let isScanning = $state(false);
  let html5QrCode: any = null;
  let hasZoomSupport = $state(false);
  let currentZoom = $state(1);
  let hasTorchSupport = $state(false);
  let isTorchOn = $state(false);

  // Lock to prevent duplicate lookup runs
  let isProcessing = $state(false);

  // Internally managed library classes
  let Html5QrcodeClass: any = null;
  let Html5QrcodeFormats: any = null;
  let isLibraryLoaded = $state(false);

  onMount(async () => {
    try {
      const module = await import("html5-qrcode");
      Html5QrcodeClass = module.Html5Qrcode;
      Html5QrcodeFormats = module.Html5QrcodeSupportedFormats;
      isLibraryLoaded = true;

      // Wait for Svelte to render the reader DOM element
      await tick();

      // Instantiate once library is ready
      html5QrCode = new Html5QrcodeClass("reader");
      
      // Auto-start scanning
      startScanning();
    } catch (err) {
      console.error("Failed to dynamically import html5-qrcode:", err);
      toast.error("Failed to load scanner library.");
    }
  });

  onDestroy(async () => {
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop();
        }
        await html5QrCode.clear();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
      html5QrCode = null;
    }
  });

  async function startScanning() {
    if (!html5QrCode) {
      if (Html5QrcodeClass) {
        html5QrCode = new Html5QrcodeClass("reader");
      } else {
        console.warn("Scanner library not loaded yet");
        return;
      }
    }
    if (isScanning) return;

    foundProduct = null;
    isScanning = true;
    isProcessing = false;
    hasZoomSupport = false;
    hasTorchSupport = false;
    isTorchOn = false;

    try {
      // Camera selector must have exactly 1 key (facingMode)
      const cameraSelector = { facingMode: "environment" };

      const scannerConfig = {
        fps: 15,
        videoConstraints: {
          facingMode: "environment",
          width: { ideal: 1920 }, // Request high resolution for sharp barcode lines
          height: { ideal: 1080 },
        },
        formatsToSupport: [
          Html5QrcodeFormats.EAN_13,
          Html5QrcodeFormats.EAN_8,
          Html5QrcodeFormats.UPC_A,
          Html5QrcodeFormats.UPC_E,
          Html5QrcodeFormats.CODE_128,
          Html5QrcodeFormats.CODE_39,
          Html5QrcodeFormats.ITF
        ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      };

      await html5QrCode.start(
        cameraSelector,
        scannerConfig,
        async (decodedText: string) => {
          if (isProcessing) return; // Prevent double-scanning
          isProcessing = true;

          if ("vibrate" in navigator) navigator.vibrate(100);
          await stopScanning();
          barcodeInput = decodedText;
          await performBarcodeLookup(decodedText);
        },
        () => {
          // Quiet frame scan failures
        }
      );

      // Check capabilities after track initializes
      setTimeout(async () => {
        if (!html5QrCode) return;
        try {
          const capabilities = html5QrCode.getRunningTrackCapabilities();
          hasZoomSupport = !!(
            capabilities &&
            capabilities.zoom &&
            capabilities.zoom.max > 1
          );
          hasTorchSupport = !!(capabilities && capabilities.torch);

          // Try to enforce continuous autofocus (greatly improves barcode scanning)
          if (
            capabilities &&
            capabilities.focusMode &&
            capabilities.focusMode.includes("continuous")
          ) {
            await html5QrCode.applyVideoConstraints({
              advanced: [{ focusMode: "continuous" }],
            });
          }
        } catch (capErr) {
          console.warn("Failed to get running track capabilities:", capErr);
        }
      }, 500);
    } catch (err) {
      console.error("Scanner startup error:", err);
      toast.error("Camera access denied or unavailable.");
      isScanning = false;
    }
  }

  async function stopScanning() {
    isScanning = false;
    hasZoomSupport = false;
    hasTorchSupport = false;
    isTorchOn = false;
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop();
        }
      } catch (e) {
        console.error("Failed to stop scanner:", e);
      }
    }
  }

  async function toggleZoom() {
    if (!html5QrCode || !hasZoomSupport) return;
    try {
      const capabilities = html5QrCode.getRunningTrackCapabilities();
      const minZoom = capabilities.zoom.min || 1;
      const maxZoom = capabilities.zoom.max || 2;

      // Cycle through zoom levels: 1x -> 2x -> Max -> 1x
      let targetZoom = 1;
      if (currentZoom === 1) targetZoom = Math.min(2.0, maxZoom);
      else if (currentZoom === 2.0 && maxZoom > 2.0) targetZoom = maxZoom;
      else targetZoom = 1;

      await html5QrCode.applyVideoConstraints({
        advanced: [{ zoom: targetZoom }],
      });
      currentZoom = targetZoom;
      toast.success(`Zoom set to ${currentZoom.toFixed(1)}x`);
    } catch (e) {
      console.error("Failed to toggle zoom:", e);
      toast.error("Failed to adjust zoom");
    }
  }

  async function toggleTorch() {
    if (!html5QrCode || !hasTorchSupport) return;
    try {
      const nextTorchState = !isTorchOn;
      await html5QrCode.applyVideoConstraints({
        advanced: [{ torch: nextTorchState }],
      });
      isTorchOn = nextTorchState;
    } catch (e) {
      console.error("Failed to toggle torch:", e);
      toast.error("Torch not supported on this camera mode");
    }
  }

  async function lookupBarcodeManual() {
    if (!barcodeInput.trim()) return;
    await performBarcodeLookup(barcodeInput.trim());
  }

  async function performBarcodeLookup(code: string) {
    lookupLoading = true;
    foundProduct = null;
    try {
      const res = await fetch("/api/nutrition/product/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.product) {
          foundProduct = data.product;
          barcodeLoggedAmount = data.product.servingSize || 100;
          toast.success(`Product found: ${data.product.name}`);
        } else {
          toast.warning(
            "Product not found. Prefilling barcode in Custom Food tab.",
          );
          onNavigateToCustom(code);
        }
      }
    } catch {
      toast.error("Error looking up barcode");
    } finally {
      lookupLoading = false;
    }
  }

  function logBarcodeProduct() {
    if (!foundProduct) return;
    onProductFound(foundProduct, barcodeLoggedAmount);
    foundProduct = null;
  }
</script>

<div class="space-y-4">
  {#if !isLibraryLoaded}
    <div class="flex flex-col items-center justify-center p-12 min-h-[250px] text-center border border-border/20 rounded-2xl bg-muted/10">
      <Spinner class="size-6 animate-spin text-primary" />
      <p class="text-xs text-muted-foreground mt-3 font-semibold">Loading camera scanner library...</p>
    </div>
  {:else}
    <!-- Camera Scanner Feed (kept in DOM, conditionally visible via CSS class to prevent timing race conditions) -->
    <div
      class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-border/40 {!isScanning ? 'hidden' : ''}"
    >
      <div
        id="reader"
        class="size-full [&_video]:object-cover [&_video]:size-full"
      ></div>

      <!-- Viewfinder Guide Overlay -->
      <div
        class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10"
      >
        <div class="relative w-[80%] h-[35%] flex items-center justify-center">
          <!-- Darken outside area with box-shadow trick -->
          <div
            class="absolute inset-0 border-2 border-dashed border-primary/80 rounded-xl bg-black/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          ></div>

          <!-- Laser Scanning Line -->
          <div
            class="absolute w-[92%] h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
          ></div>

          <span
            class="absolute -bottom-7 text-[10px] font-black text-white bg-black/70 px-2.5 py-1 rounded-full tracking-wide whitespace-nowrap"
          >
            ALIGN BARCODE IN BOX
          </span>
        </div>
      </div>

      <!-- Dynamic Control Buttons Overlay -->
      <div
        class="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20"
      >
        <div class="flex gap-2">
          {#if hasZoomSupport}
            <Button
              size="sm"
              variant="secondary"
              onclick={toggleZoom}
              class="h-8 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-bold border border-white/10"
            >
              Zoom: {currentZoom.toFixed(1)}x
            </Button>
          {/if}
          {#if hasTorchSupport}
            <Button
              size="sm"
              variant="secondary"
              onclick={toggleTorch}
              class="h-8 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-bold border border-white/10"
            >
              Torch: {isTorchOn ? "ON" : "OFF"}
            </Button>
          {/if}
        </div>

        <Button
          size="sm"
          variant="secondary"
          onclick={stopScanning}
          class="h-8 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-bold border border-white/10"
        >
          Stop Camera
        </Button>
      </div>
    </div>

    <!-- Camera Scanner Off/Loading Placeholder -->
    {#if !isScanning}
      <div
        class="w-full aspect-[4/3] rounded-2xl bg-muted/20 border border-dashed border-border/40 flex flex-col items-center justify-center p-6 text-center relative"
      >
        <Spinner class="size-8 animate-spin text-primary mb-3" />
        <span class="text-sm font-bold text-foreground">Starting camera feed...</span>
        <p class="text-xs text-muted-foreground mt-1 max-w-[240px]">
          Please allow camera permissions if prompted.
        </p>
      </div>
    {/if}

    <!-- Manual/Prefilled Entry -->
    <div class="space-y-2 pt-4 border-t border-border/20">
      <Label
        for="barcode-manual"
        class="text-xs font-bold text-muted-foreground block"
        >Or check barcode manually</Label
      >
      <div class="flex gap-2">
        <div class="relative flex-1">
          <BarcodeIcon
            class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            id="barcode-manual"
            type="text"
            placeholder="Enter EAN barcode (e.g. 6411401015050)"
            bind:value={barcodeInput}
            class="pl-10 rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <Button
          onclick={lookupBarcodeManual}
          variant="secondary"
          class="rounded-2xl font-bold text-xs border border-border/20 shadow-sm"
          disabled={lookupLoading || !barcodeInput.trim()}
        >
          {#if lookupLoading}
            <Spinner class="size-4 mr-1.5 animate-spin" />
          {/if}
          Check Product
        </Button>
      </div>
    </div>

    <!-- Lookup Result -->
    {#if foundProduct}
      <div
        class="p-4 bg-muted/20 border border-border/40 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-1 duration-150"
      >
        <div>
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-foreground">{foundProduct.name}</h4>
            {#if foundProduct.brand}
              <span
                class="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold"
                >{foundProduct.brand}</span
              >
            {/if}
          </div>
          <p class="text-[10px] text-muted-foreground mt-1">
            {foundProduct.calories} kcal/100g
          </p>

          <!-- Extended nutrition display -->
          <div
            class="grid grid-cols-4 gap-2 text-[9px] font-mono text-center bg-card/60 p-2.5 rounded-xl mt-2 border border-border/20"
          >
            <div>P: {foundProduct.protein}g</div>
            <div>C: {foundProduct.carbs}g</div>
            <div>F: {foundProduct.fat}g</div>
            <div>Salt: {foundProduct.salt}g</div>
            <div class="col-span-2">Sugar: {foundProduct.sugars}g</div>
            <div class="col-span-2">Sat Fat: {foundProduct.saturatedFat}g</div>
          </div>
        </div>

        <div class="space-y-1.5">
          <Label
            for="barcode-weight"
            class="text-[11px] font-bold text-muted-foreground"
            >Weight Consumed (grams)</Label
          >
          <Input
            id="barcode-weight"
            type="number"
            bind:value={barcodeLoggedAmount}
            class="rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
            min="1"
          />
        </div>

        <Button onclick={logBarcodeProduct} class="w-full rounded-2xl font-bold">
          Log to Daily Food Log
        </Button>
      </div>
    {/if}
  {/if}
</div>
