<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LabTestCard from "./LabTestCard.svelte";
  import type { LabTest } from "$lib/types";
  import HeartRateMonitorIcon from "@tabler/icons-svelte/icons/heart-rate-monitor";
  import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
  import ShieldCheckIcon from "@tabler/icons-svelte/icons/shield-check";
  import ActivityIcon from "@tabler/icons-svelte/icons/activity";

  // Mock lab test data satisfying LabTest type
  // Date values are Unix timestamps in seconds (approx. 2-month intervals in 2024-2026)
  const mockTests: LabTest[] = [
    {
      id: "apob",
      name: "Apolipoprotein B (ApoB)",
      description: "Direct measurement of the total number of atherogenic particles in your blood. Highly superior to standard LDL cholesterol for predicting cardiovascular disease risk.",
      price: 25.0,
      lowerLimit: 0.6,
      upperLimit: 1.2,
      unit: "g/L",
      past_values: [
        { date: 1704067200, number: 0.72 }, // Jan 1, 2024
        { date: 1709251200, number: 0.70 }, // Mar 1, 2024
        { date: 1714521650, number: 0.73 }, // May 1, 2024
        { date: 1719792000, number: 0.71 }, // Jul 1, 2024
        { date: 1725148800, number: 1.15 }  // Sep 1, 2024 - Massive jump
      ]
    },
    {
      id: "hba1c",
      name: "HbA1c (Glycated Hemoglobin)",
      description: "Reflects your average blood sugar levels over the past 3 months. Essential for detecting pre-diabetes and monitoring metabolic health.",
      price: 18.0,
      lowerLimit: 20,
      upperLimit: 42,
      unit: "mmol/mol",
      past_values: [
        { date: 1704067200, number: 32.5 },
        { date: 1709251200, number: 33.1 },
        { date: 1714521650, number: 31.8 },
        { date: 1719792000, number: 32.4 },
        { date: 1725148800, number: 32.8 }  // Perfectly stable
      ]
    },
    {
      id: "hscrp",
      name: "High-Sensitivity CRP (hs-CRP)",
      description: "Sensitive marker of systemic low-grade inflammation. Elevated levels are linked to cardiovascular risk, overtraining, and metabolic stress.",
      price: 15.0,
      lowerLimit: 0.0,
      upperLimit: 1.0,
      unit: "mg/L",
      past_values: [
        { date: 1704067200, number: 0.25 },
        { date: 1709251200, number: 0.22 },
        { date: 1714521650, number: 0.30 },
        { date: 1719792000, number: 0.27 },
        { date: 1725148800, number: 2.15 }  // Spiking high
      ]
    },
    {
      id: "alat",
      name: "ALAT (ALT / Alanine Aminotransferase)",
      description: "Liver enzyme. Elevated levels indicate liver cellular stress, fatty liver, or potential damage.",
      price: 12.0,
      lowerLimit: 10,
      upperLimit: 50,
      unit: "U/L",
      past_values: [
        { date: 1704067200, number: 18.0 },
        { date: 1709251200, number: 20.0 },
        { date: 1714521650, number: 19.5 },
        { date: 1719792000, number: 22.0 },
        { date: 1725148800, number: 24.0 }
      ]
    },
    {
      id: "testosterone",
      name: "Total Testosterone",
      description: "Primary sex hormone. Vital for protein synthesis, muscle mass, energy, bone density, and nervous system recovery.",
      price: 35.0,
      lowerLimit: 10,
      upperLimit: 30,
      unit: "nmol/L",
      past_values: [
        { date: 1704067200, number: 12.1 },
        { date: 1709251200, number: 12.4 },
        { date: 1714521650, number: 11.9 },
        { date: 1719792000, number: 12.2 },
        { date: 1725148800, number: 12.0 }  // Stable, but clinically low
      ]
    },
    {
      id: "vitamind",
      name: "Vitamin D (25-OH)",
      description: "Crucial for bone health, immune function, and overall hormonal balance. Particularly important in northern latitudes.",
      price: 22.0,
      lowerLimit: 75,
      upperLimit: 150,
      unit: "nmol/L",
      past_values: [
        { date: 1704067200, number: 55.0 }, // Deficient
        { date: 1709251200, number: 68.0 },
        { date: 1714521650, number: 80.0 }, // Normal
        { date: 1719792000, number: 95.0 },
        { date: 1725148800, number: 112.0 } // Optimal trend upwards
      ]
    }
  ];

  let activeFilter = $state<"all" | "normal" | "out-of-range">("all");

  // Status statistics helper
  function checkOutOfRange(test: LabTest): boolean {
    const latest = test.past_values[test.past_values.length - 1]?.number;
    if (latest === undefined) return false;
    const isLow = test.lowerLimit !== undefined && latest < test.lowerLimit;
    const isHigh = test.upperLimit !== undefined && latest > test.upperLimit;
    return isLow || isHigh;
  }

  const outOfRangeCount = $derived(mockTests.filter(checkOutOfRange).length);
  const inRangeCount = $derived(mockTests.length - outOfRangeCount);

  // Filtered tests based on active filter button
  const filteredTests = $derived(
    mockTests.filter((test) => {
      const isOutOfRange = checkOutOfRange(test);
      if (activeFilter === "normal") return !isOutOfRange;
      if (activeFilter === "out-of-range") return isOutOfRange;
      return true;
    })
  );
</script>

<div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
  <!-- Summary Statistics acting as Interactive Filter Tabs -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Total Biomarkers Card -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => (activeFilter = "all")}
      class={cn(
        "flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md select-none",
        activeFilter === "all"
          ? "border-primary ring-1 ring-primary/20 bg-primary/5"
          : "border-border/80 hover:border-primary/30"
      )}
    >
      <div class="p-3 bg-primary/10 rounded-xl">
        <HeartRateMonitorIcon class="size-6 text-primary" />
      </div>
      <div>
        <span class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tracked</span>
        <span class="text-2xl font-extrabold font-mono text-foreground mt-0.5 block">
          {mockTests.length}
        </span>
      </div>
    </div>

    <!-- Normal/In Range Card -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => (activeFilter = "normal")}
      class={cn(
        "flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md select-none",
        activeFilter === "normal"
          ? "border-success ring-1 ring-success/20 bg-success/5"
          : "border-border/80 hover:border-success/30"
      )}
    >
      <div class="p-3 bg-success/10 rounded-xl">
        <ShieldCheckIcon class="size-6 text-success" />
      </div>
      <div>
        <span class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Normal</span>
        <span class="text-2xl font-extrabold font-mono text-foreground mt-0.5 block">
          {inRangeCount}
        </span>
      </div>
    </div>

    <!-- Out of Range Card -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => (activeFilter = "out-of-range")}
      class={cn(
        "flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md select-none",
        activeFilter === "out-of-range"
          ? "border-destructive ring-1 ring-destructive/20 bg-destructive/5"
          : "border-border/80 hover:border-destructive/30"
      )}
    >
      <div class="p-3 bg-destructive/10 rounded-xl">
        <AlertCircleIcon class="size-6 text-destructive" />
      </div>
      <div>
        <span class="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Out of Range</span>
        <span class="text-2xl font-extrabold font-mono text-foreground mt-0.5 block">
          {outOfRangeCount}
        </span>
      </div>
    </div>
  </div>

  <!-- Biomarkers Grid -->
  {#if filteredTests.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTests as test (test.id)}
        <LabTestCard {test} />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/5 text-center">
      <ActivityIcon class="size-8 text-muted-foreground mb-3" />
      <h3 class="font-bold text-base text-foreground">No biomarkers found</h3>
      <p class="text-sm text-muted-foreground mt-1 max-w-xs">
        No lab tests match the current filter selection.
      </p>
    </div>
  {/if}
</div>
