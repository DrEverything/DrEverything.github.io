<script lang="ts">
  import { onMount } from "svelte";
  import { post } from "$lib/utils";
  // import LabPanel from "./LabPanel.svelte";
  import LandingPage from "./landingPage.svelte";

  // post("health/profile", {
  //   whatever: "something",
  // });

  // 1. Structural Typings for Database/Frontend Integrity
  interface Biomarker {
    loinc: string;
    name: string;
    unit: string;
    category: "hormone" | "lipid" | "metabolic" | "inflammation" | "vitamin";
    description: string;
  }

  interface Panel {
    id: string;
    name: string;
    description: string;
    wholesaleCostEur: number; // Synlab wholesale cost estimate
    retailPriceEur: number; // Under-cutting Finnish market price
    targetAudience: string[];
    biomarkers: Biomarker[];
  }

  // 2. High-Intent Launch Panels (The Core Offer)
  const activePanels: Panel[] = [
    {
      id: "panel_performance_male",
      name: "Male Performance & HRT Profile",
      description:
        "Optimized for athletes, powerlifters, and men on Testosterone Replacement Therapy (TRT). Tracks hormonal baseline, androgen status, and cardiovascular risk vectors.",
      wholesaleCostEur: 42.0,
      retailPriceEur: 119.0,
      targetAudience: ["powerlifting", "TRT", "bodybuilding", "athletics"],
      biomarkers: [
        {
          loinc: "2986-8",
          name: "Testosterone (Total)",
          unit: "nmol/l",
          category: "hormone",
          description:
            "Primary male sex hormone. Baseline for anabolic state and energy.",
        },
        {
          loinc: "13967-5",
          name: "Sex Hormone-Binding Globulin (SHBG)",
          unit: "nmol/l",
          category: "hormone",
          description:
            "Carrier protein. Determines the ratio of free (active) testosterone.",
        },
        {
          loinc: "2243-4",
          name: "Estradiol (E2)",
          unit: "pmol/l",
          category: "hormone",
          description:
            "Estrogen baseline. Critical for bone density, libido, and joint health.",
        },
        {
          loinc: "2276-4",
          name: "Ferritin",
          unit: "µg/l",
          category: "metabolic",
          description:
            "Iron storage. Essential for oxygen transport, energy, and detecting cellular damage.",
        },
      ],
    },
    {
      id: "panel_metabolic_cardio",
      name: "Advanced Longevity & Cardiovascular Profile",
      description:
        "Engineered for biohackers and longevity-focused individuals. Bypasses standard population averages to trace actual atherosclerotic and metabolic risk factors.",
      wholesaleCostEur: 38.0,
      retailPriceEur: 99.0,
      targetAudience: [
        "biohacking",
        "longevity",
        "cardiovascular",
        "dietary-tracking",
      ],
      biomarkers: [
        {
          loinc: "1871-3",
          name: "Apolipoprotein B (ApoB)",
          unit: "g/l",
          category: "lipid",
          description:
            "Direct count of all atherogenic particles. Highly superior to standard LDL-C.",
        },
        {
          loinc: "4548-4",
          name: "HbA1c (Glycated Hemoglobin)",
          unit: "mmol/mol",
          category: "metabolic",
          description:
            "Standard IFCC marker for 3-month average glucose levels and insulin sensitivity.",
        },
        {
          loinc: "30522-7",
          name: "High-Sensitivity CRP (hs-CRP)",
          unit: "mg/l",
          category: "inflammation",
          description:
            "Ultra-sensitive systemic inflammation marker. Predicts vascular risk.",
        },
        {
          loinc: "20436-2",
          name: "Fasting Insulin",
          unit: "mU/l",
          category: "metabolic",
          description:
            "Detects early insulin resistance years before HbA1c or fasting glucose flags it.",
        },
      ],
    },
    {
      id: "panel_essential_baseline",
      name: "Essential Health Baseline",
      description:
        "The low-cost starting point for general health tracking. Establishes clean baselines for lipid profiles and thyroid output.",
      wholesaleCostEur: 22.0,
      retailPriceEur: 59.0,
      targetAudience: ["general-health", "beginners", "vegetarians"],
      biomarkers: [
        {
          loinc: "2093-3",
          name: "Total Cholesterol",
          unit: "mmol/l",
          category: "lipid",
          description: "Standard lipid marker.",
        },
        {
          loinc: "2085-9",
          name: "HDL Cholesterol",
          unit: "mmol/l",
          category: "lipid",
          description: "High-density lipoprotein baseline.",
        },
        {
          loinc: "18262-6",
          name: "LDL Cholesterol",
          unit: "mmol/l",
          category: "lipid",
          description: "Low-density lipoprotein baseline.",
        },
        {
          loinc: "11579-0",
          name: "Thyroid Stimulating Hormone (TSH)",
          unit: "mU/l",
          category: "hormone",
          description: "Primary feedback marker for thyroid metabolic rate.",
        },
        {
          loinc: "62292-8",
          name: "Vitamin D (25-OH)",
          unit: "nmol/l",
          category: "vitamin",
          description:
            "Essential hormone precursor for immunity, bone strength, and mood in northern latitudes.",
        },
      ],
    },
  ];

  let date = new Date().toISOString();

  console.log(date);

  // 3. Automated On-Mount Payload Sync
  // onMount(async () => {
  //   try {
  //     const response = await post("health/profile", {
  //       client_timestamp: new Date().toISOString(),
  //       supported_loinc_codes: activePanels.flatMap((p) =>
  //         p.biomarkers.map((b) => b.loinc),
  //       ),
  //       configured_panels: activePanels.map((p) => ({
  //         id: p.id,
  //         name: p.name,
  //         retail_price: p.retailPriceEur,
  //         unit_schema: "SI_METRIC_FI", // Enforces standard Finnish clinical units (e.g. mmol/mol for HbA1c)
  //       })),
  //     });
  //     console.log("Monada OS: Lab profiles synced successfully.", response);
  //   } catch (error) {
  //     console.error("Monada OS: Lab profiles failed to sync.", error);
  //   }
  // });
</script>

<!-- <LandingPage /> -->

<!-- <LabPanel /> -->
