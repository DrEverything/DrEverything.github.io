<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Graph from "./graph.svelte";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { LabTest } from "$lib/types";

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
</script>

<div class="flex flex-col gap-6 p-8 items-center max-w-4xl mx-auto">
  <div class="text-center mb-4">
    <h1 class="text-2xl font-bold tracking-tight">Blood Lab Test History</h1>
    <p class="text-sm text-muted-foreground mt-1">
      Hover over any biomarker to view its historical trend and reference ranges.
    </p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full justify-center">
    {#each mockTests as test (test.id)}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button
                variant="outline"
                class="w-full h-18 flex flex-col justify-center items-center gap-1 p-4"
                {...props}
              >
                <span class="font-semibold text-sm text-center">{test.name}</span>
                <span class="text-xs text-muted-foreground font-mono">
                  Latest: {test.past_values[test.past_values.length - 1].number} {test.unit}
                </span>
              </Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            class="w-[500px] p-0 bg-card! text-card-foreground! border! border-border! shadow-xl! rounded-xl! overflow-visible"
            arrowClasses="bg-card! border-r! border-b! border-border!"
          >
            <Graph {test} class="border-0! shadow-none! bg-transparent! py-0!" />
          </Tooltip.Content>
        </Tooltip.Root>
    {/each}
  </div>
</div>
