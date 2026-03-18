<script lang="ts">
  import Healthcare from "./Healthcare.svelte";
  import Food from "./Food.svelte";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  interface FinancialEntry {
    id: string;
    category: string;
    specification: string;
    costEur: number;
    recurring?: boolean;
  }

  interface Holon {
    id: String;
    name: String;
    divisions: Holon[];
    valueation?: number;
  }

  const clinic = $state({
    departments: [
      {
        name: "Diagnostics",
      },
    ],
  });

  const CLINIC_CAPEX: FinancialEntry[] = $state([
    {
      id: "EQUIP_MRI_3T",
      category: "Hardware",
      specification: "Refurbished Siemens/GE 3T or United Imaging 1.5T",
      costEur: 450_000,
    },
    {
      id: "EQUIP_XRAY_DR",
      category: "Hardware",
      specification: "Digital Radiography System (New/Refurbished)",
      costEur: 55_000,
    },
    {
      id: "EQUIP_US_CART",
      category: "Hardware",
      specification: "High-end Point-of-Care Ultrasound (Mindray/GE)",
      costEur: 25_000,
    },
    {
      id: "EQUIP_LAB_SUITE",
      category: "Hardware",
      specification: "Automated Clinical Chem + Immunoassay (Roche/Siemens)",
      costEur: 90_000,
    },
    {
      id: "INFRA_SHIELDING",
      category: "Construction",
      specification: "MRI Faraday Cage + Lead-lined X-Ray Room",
      costEur: 75_000,
    },
    {
      id: "INFRA_RENO",
      category: "Construction",
      specification: "HVAC/Cooling + Power Grid Upgrades + PACU Setup",
      costEur: 60_000,
    },
    {
      id: "SOFT_EMPIRE_OS",
      category: "Technology",
      specification: "Local Nodes + PACS Integration + Adversarial Hub",
      costEur: 20_000,
    },
    {
      id: "REG_LICENSING",
      category: "Legal",
      specification: "Valvira/Terviseamet + Radiation Permits + EU Compliance",
      costEur: 25_000,
    },
    {
      id: "INV_INITIAL",
      category: "Logistics",
      specification: "Reagents + Contrast + Consumables (3 Month Buffer)",
      costEur: 25_000,
    },
  ]);

  const CLINIC_OPEX: FinancialEntry[] = $state([
    {
      id: "OPS_RENT",
      category: "Fixed",
      specification: "Industrial Warehouse (Juvanmalmi or Tallinn D-Terminal)",
      costEur: 5_500,
      recurring: true,
    },
    {
      id: "OPS_ENERGY",
      category: "Fixed",
      specification: "High-draw Helium Compressor + Chiller + Lab Load",
      costEur: 3_500,
      recurring: true,
    },
    {
      id: "LABOR_RADIOGRAPHERS",
      category: "Labor",
      specification: "4x Greek Arbitrage Rotation (€2.5k + A1 Certificates)",
      costEur: 14_000,
      recurring: true,
    },
    {
      id: "LABOR_INTAKE",
      category: "Labor",
      specification: "1x Local Registered Nurse (Phlebotomy/Intake)",
      costEur: 4_000,
      recurring: true,
    },
    {
      id: "BOUNTY_READING",
      category: "Adversarial",
      specification: "Remote Radiologist Bounty (Avg 10 Scans/Day Vol)",
      costEur: 12_000,
      recurring: true,
    },
    {
      id: "OPS_MAINTENANCE",
      category: "Maintenance",
      specification: "Third-party ISO Service Contracts (MRI/Lab)",
      costEur: 4_000,
      recurring: true,
    },
    {
      id: "OPS_LOGISTICS",
      category: "Logistics",
      specification: "Tallink Silja 24-Trip Tickets + Cloud Infrastructure",
      costEur: 2_500,
      recurring: true,
    },
  ]);
  let something = $state("Hristos");
</script>

<Dashboard />

<!-- <Login /> -->
<!---->
<!-- <Healthcare /> -->
