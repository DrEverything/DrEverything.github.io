<script lang="ts">
  import Dashboard from "./dashboard.svelte";
  import { onMount } from "svelte";

  // Mock lab test data satisfying LabTest type
  // Date values are Unix timestamps in seconds (approx. 2-month intervals in 2024-2026)
  const mockTests = [
    {
      id: "apob",
      name: "Apolipoprotein B (ApoB)",
      description: "Direct measurement of the total number of atherogenic particles in your blood. Highly superior to standard LDL cholesterol for predicting cardiovascular disease risk.",
      price: 25.0,
      past_values: [
        { date: 1704067200, number: 0.72 }, // Jan 1, 2024
        { date: 1709251200, number: 0.70 }, // Mar 1, 2024
        { date: 1714521650, number: 0.73 }, // May 1, 2024
        { date: 1719792000, number: 0.71 }, // Jul 1, 2024
        { date: 1725148800, number: 1.15 }  // Sep 1, 2024 - Massive jump (+4.2σ) but technically still within the "standard population normal range" of 0.6 - 1.2 g/l
      ]
    },
    {
      id: "hba1c",
      name: "HbA1c (Glycated Hemoglobin)",
      description: "Reflects your average blood sugar levels over the past 3 months. Essential for detecting pre-diabetes and monitoring metabolic health.",
      price: 18.0,
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
      past_values: [
        { date: 1704067200, number: 0.25 },
        { date: 1709251200, number: 0.22 },
        { date: 1714521650, number: 0.30 },
        { date: 1719792000, number: 0.27 },
        { date: 1725148800, number: 2.15 }  // Spiking high (+3.9σ) and clinical normal is < 1.0 mg/l
      ]
    },
    {
      id: "alat",
      name: "ALAT (ALT / Alanine Aminotransferase)",
      description: "Liver enzyme. Elevated levels indicate liver cellular stress, fatty liver, or potential damage.",
      price: 12.0,
      past_values: [
        { date: 1719792000, number: 22.0 },
        { date: 1725148800, number: 24.0 }  // Only 2 values: calibration/establishing baseline
      ]
    },
    {
      id: "testosterone",
      name: "Total Testosterone",
      description: "Primary sex hormone. Vital for protein synthesis, muscle mass, energy, bone density, and nervous system recovery.",
      price: 35.0,
      past_values: [
        { date: 1704067200, number: 12.1 },
        { date: 1709251200, number: 12.4 },
        { date: 1714521650, number: 11.9 },
        { date: 1719792000, number: 12.2 },
        { date: 1725148800, number: 12.0 }  // Stable, but clinically low (normal population range: 10 - 30 nmol/l)
      ]
    },
    {
      id: "vitamind",
      name: "Vitamin D (25-OH)",
      description: "Crucial for bone health, immune function, and overall hormonal balance. Particularly important in northern latitudes like Finland.",
      price: 22.0,
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

<!-- Render the health dashboard component with mock lab tests -->
<Dashboard biomarkers={mockTests} />
