<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LabTestCard from "./LabTestCard.svelte";
  import type { LabTest } from "$lib/types";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
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
  <!-- Rich Tab Filter Bar -->
  <Tabs bind:value={activeFilter} class="w-full">
    <TabsList class="h-auto w-fit mx-auto flex gap-1 rounded-2xl p-1">
      <TabsTrigger
        value="all"
        class={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2.5 h-auto transition-all duration-200 border border-transparent",
          "data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:border-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm",
          "hover:bg-muted/50"
        )}
      >
        <div class={cn(
          "p-1.5 rounded-lg transition-colors bg-primary/10 text-primary",
          activeFilter === "all" ? "bg-primary/20" : ""
        )}>
          <HeartRateMonitorIcon class="size-3.5" />
        </div>
        <div class="text-left">
          <span class="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">All</span>
          <span class={cn(
            "text-sm font-extrabold font-mono leading-tight mt-0.5 block",
            activeFilter === "all" ? "text-primary" : "text-foreground"
          )}>{mockTests.length}</span>
        </div>
      </TabsTrigger>

      <TabsTrigger
        value="normal"
        class={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2.5 h-auto transition-all duration-200 border border-transparent",
          "data-[state=active]:bg-success/10 dark:data-[state=active]:bg-success/20 data-[state=active]:border-success/20 data-[state=active]:text-success data-[state=active]:shadow-sm",
          "hover:bg-muted/50"
        )}
      >
        <div class={cn(
          "p-1.5 rounded-lg transition-colors bg-success/10 text-success",
          activeFilter === "normal" ? "bg-success/20" : ""
        )}>
          <ShieldCheckIcon class="size-3.5" />
        </div>
        <div class="text-left">
          <span class="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">Normal</span>
          <span class={cn(
            "text-sm font-extrabold font-mono leading-tight mt-0.5 block",
            activeFilter === "normal" ? "text-success" : "text-foreground"
          )}>{inRangeCount}</span>
        </div>
      </TabsTrigger>

      <TabsTrigger
        value="out-of-range"
        class={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2.5 h-auto transition-all duration-200 border border-transparent",
          "data-[state=active]:bg-destructive/10 dark:data-[state=active]:bg-destructive/20 data-[state=active]:border-destructive/20 data-[state=active]:text-destructive data-[state=active]:shadow-sm",
          "hover:bg-muted/50"
        )}
      >
        <div class={cn(
          "p-1.5 rounded-lg transition-colors",
          outOfRangeCount > 0 
            ? (activeFilter === "out-of-range" ? "bg-destructive/25 text-destructive" : "bg-destructive/15 text-destructive")
            : "bg-muted text-muted-foreground"
        )}>
          <AlertCircleIcon class="size-3.5" />
        </div>
        <div class="text-left">
          <span class="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">Flagged</span>
          <span class={cn(
            "text-sm font-extrabold font-mono leading-tight mt-0.5 block",
            outOfRangeCount > 0 ? "text-destructive" : "text-muted-foreground"
          )}>{outOfRangeCount}</span>
        </div>
      </TabsTrigger>
    </TabsList>
  </Tabs>

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
