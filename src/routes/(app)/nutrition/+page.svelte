<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/components/ui/toast";
  import { Spinner } from "$lib/components/ui/spinner";
  import SettingsIcon from "@tabler/icons-svelte/icons/settings";
  import ChevronLeftIcon from "@tabler/icons-svelte/icons/chevron-left";
  import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
  import AppleIcon from "@tabler/icons-svelte/icons/apple";

  import CaloriesGauge from "./CaloriesGauge.svelte";
  import NutritionLabel from "./NutritionLabel.svelte";
  import MealsLog from "./MealsLog.svelte";
  import SettingsModal from "./SettingsModal.svelte";
  import LogFoodModal from "./LogFoodModal.svelte";

  // --- Date Handling ---
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (dateStr: string) => {
    const today = getTodayString();
    if (dateStr === today) return "Today";
    
    const d = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (dateStr === yesterdayStr) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  let date = $state(getTodayString());

  function changeDate(days: number) {
    const current = new Date(date);
    current.setDate(current.getDate() + days);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    date = `${year}-${month}-${day}`;
  }

  // --- Target Nutrition Settings ---
  let targets = $state({
    calories: 2000,
    protein: 130,
    carbs: 220,
    fat: 65,
    saturatedFat: 22,
    sugars: 50,
    fiber: 30,
    salt: 5
  });

  let showSettingsModal = $state(false);
  let showLogModal = $state(false);

  onMount(async () => {
    const saved = localStorage.getItem("nutrition_targets");
    if (saved) {
      try {
        targets = JSON.parse(saved);
      } catch {}
    }
  });

  function saveTargets(newTargets: any) {
    targets = newTargets;
    localStorage.setItem("nutrition_targets", JSON.stringify(targets));
    toast.success("Daily nutritional targets updated");
  }

  // --- Data Loading ---
  let logs = $state<any[]>([]);
  let loading = $state(true);

  async function loadLogs() {
    loading = true;
    try {
      const res = await fetch("/api/nutrition/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date })
      });
      if (res.ok) {
        logs = await res.json();
      } else {
        toast.error("Failed to load logs");
      }
    } catch {
      toast.error("Error connecting to server");
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (date) {
      loadLogs();
    }
  });

  // --- Daily Totals (derived) ---
  const totals = $derived({
    calories: logs.reduce((sum, item) => sum + (item.amount / 100) * item.product.calories, 0),
    protein: logs.reduce((sum, item) => sum + (item.amount / 100) * item.product.protein, 0),
    carbs: logs.reduce((sum, item) => sum + (item.amount / 100) * item.product.carbs, 0),
    fat: logs.reduce((sum, item) => sum + (item.amount / 100) * item.product.fat, 0),
    saturatedFat: logs.reduce((sum, item) => sum + (item.amount / 100) * (item.product.saturatedFat || 0), 0),
    sugars: logs.reduce((sum, item) => sum + (item.amount / 100) * (item.product.sugars || 0), 0),
    fiber: logs.reduce((sum, item) => sum + (item.amount / 100) * (item.product.fiber || 0), 0),
    salt: logs.reduce((sum, item) => sum + (item.amount / 100) * (item.product.salt || 0), 0)
  });

  // --- Actions ---
  async function removeLog(logId: string) {
    if (!confirm("Are you sure you want to remove this logged food?")) return;
    try {
      const res = await fetch("/api/nutrition/log/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId })
      });
      if (res.ok) {
        logs = logs.filter((l) => l.logId !== logId);
        toast.success("Food removed");
      } else {
        toast.error("Failed to delete log entry");
      }
    } catch {
      toast.error("Error deleting log entry");
    }
  }

  async function updateLogAmount(logId: string, amount: number) {
    try {
      const res = await fetch("/api/nutrition/log/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId,
          amount,
          mealType: "Default"
        })
      });
      if (res.ok) {
        logs = logs.map((l) => {
          if (l.logId === logId) {
            return { ...l, amount };
          }
          return l;
        });
        toast.success("Food entry updated");
      } else {
        toast.error("Failed to update log entry");
      }
    } catch {
      toast.error("Error updating log entry");
    }
  }

  async function addLogEntry(barcodeOrId: string, amount: number, productDetails: any) {
    try {
      const res = await fetch("/api/nutrition/log/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcodeOrId,
          date,
          mealType: "Default",
          amount,
          product: productDetails
        })
      });

      if (res.ok) {
        const newLog = await res.json();
        logs = [...logs, newLog];
        toast.success(`Logged ${amount}g of ${productDetails.name}`);
      } else {
        toast.error("Failed to log food");
      }
    } catch {
      toast.error("Error logging food");
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24">
  <!-- Top Navigation & Settings -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/40 backdrop-blur-xl border border-border/40 p-4 rounded-3xl shadow-xl">
    <div class="flex items-center gap-2">
      <div class="p-2.5 rounded-2xl bg-primary/10 text-primary">
        <AppleIcon class="size-6" />
      </div>
      <div>
        <h1 class="text-xl font-black tracking-tight">Nutrition Tracker</h1>
        <p class="text-xs text-muted-foreground">Log foods & monitor nutrition label details</p>
      </div>
    </div>

    <!-- Date Swiper -->
    <div class="flex items-center bg-muted/40 rounded-2xl p-1 border border-border/20">
      <button 
        onclick={() => changeDate(-1)} 
        class="p-2 hover:bg-card rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
        aria-label="Previous day"
      >
        <ChevronLeftIcon class="size-4" />
      </button>
      
      <span class="px-4 text-sm font-bold min-w-[140px] text-center">
        {formatDateLabel(date)}
      </span>

      <button 
        onclick={() => changeDate(1)} 
        class="p-2 hover:bg-card rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
        aria-label="Next day"
      >
        <ChevronRightIcon class="size-4" />
      </button>
    </div>

    <button 
      onclick={() => showSettingsModal = true}
      class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm transition-all duration-200 shadow-sm border border-border/20"
    >
      <SettingsIcon class="size-4" />
      Set Targets
    </button>
  </div>

  {#if loading}
    <div class="flex flex-col items-center justify-center p-12 min-h-[350px]">
      <Spinner class="size-8 animate-spin text-primary" />
      <p class="text-sm text-muted-foreground mt-4">Retrieving your nutrition log…</p>
    </div>
  {:else}
    <!-- Daily Summary Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CaloriesGauge calories={totals.calories} target={targets.calories} />
      <NutritionLabel {totals} {targets} />
    </div>

    <!-- Meals Log -->
    <MealsLog 
      {logs} 
      onRemove={removeLog} 
      onUpdate={updateLogAmount} 
      onAddClick={() => showLogModal = true} 
    />
  {/if}
</div>

<!-- Settings Modal -->
<SettingsModal 
  bind:open={showSettingsModal} 
  {targets} 
  onSave={saveTargets} 
/>

<!-- Log Food Modal -->
<LogFoodModal 
  bind:open={showLogModal} 
  onLog={addLogEntry} 
/>
