<script lang="ts">
  import { cn } from "$lib/utils.js";
  import BloodMarkerCard from "./BloodMarkerCard.svelte";
  import type { BloodMarker } from "$lib/types";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
  import HeartRateMonitorIcon from "@tabler/icons-svelte/icons/heart-rate-monitor";
  import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
  import ShieldCheckIcon from "@tabler/icons-svelte/icons/shield-check";
  import ActivityIcon from "@tabler/icons-svelte/icons/activity";
  import { toast } from "$lib/components/ui/toast";
  import { onMount } from "svelte";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";

  let tests = $state<BloodMarker[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch("/api/health/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        tests = await res.json();
      } else {
        // toast.error("Failed to load lab tests");
      }
    } catch {
      toast.error("Error loading lab tests");
    } finally {
      loading = false;
    }
  });

  let activeFilter = $state<"all" | "normal" | "out-of-range">("all");

  // Status statistics helper
  function checkOutOfRange(marker: BloodMarker): boolean {
    const latest = marker.values[marker.values.length - 1]?.number;
    if (latest === undefined) return false;
    return latest < marker.lowerLimit || latest > marker.upperLimit;
  }

  const outOfRangeCount = $derived(tests.filter(checkOutOfRange).length);
  const inRangeCount = $derived(tests.length - outOfRangeCount);

  // Filtered tests based on active filter button
  const filteredTests = $derived(
    tests.filter((marker) => {
      const isOutOfRange = checkOutOfRange(marker);
      if (activeFilter === "normal") return !isOutOfRange;
      if (activeFilter === "out-of-range") return isOutOfRange;
      return true;
    })
  );
</script>

<div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
  {#if loading}
    <div class="flex flex-col items-center justify-center p-12 min-h-[350px]">
      <Spinner class="size-8 animate-spin text-primary" />
      <p class="text-sm text-muted-foreground mt-4">Retrieving your biomarkers…</p>
    </div>
  {:else}
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
            )}>{tests.length}</span>
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
          <BloodMarkerCard {test} />
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
  {/if}
</div>
