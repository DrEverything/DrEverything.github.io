<script lang="ts">
  import SiteHeader from "$lib/components/site-header.svelte";
  import SectionCards from "$lib/components/section-cards.svelte";
  import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
  import LayoutGrid from "@tabler/icons-svelte/icons/grid-dots";
  import * as Popover from "$lib/components/ui/popover";

  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<SectionCards
  cards={[
    {
      label: "Budget Remaining",
      value: -13600,
      previousValue: 50000,
      format: (v) => `$${v.toLocaleString()}`,
      description: "Rocket project overspent",
    },
    {
      label: "Tasks Done",
      value: 34,
      previousValue: 20,
      description: "This week vs last",
    },
    {
      label: "Hours Available",
      value: 12.5,
      format: (v) => `${v}h`,
    },
  ]}
/>
<div class="px-4 lg:px-6">
  <ChartAreaInteractive
    title="Budget Over Time"
    description="Spend vs remaining across all projects"
    referenceDate={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
    data={[
      { date: new Date("2025-08-01"), spent: 22, remaining: 100 },
      { date: new Date("2025-08-02"), spent: 122, remaining: 120 },
      { date: new Date("2026-03-01"), spent: 222, remaining: 150 },
      { date: new Date("2026-03-02"), spent: 97, remaining: 180 },
      { date: new Date("2026-03-03"), spent: 167, remaining: 120 },
      { date: new Date("2026-03-04"), spent: 242, remaining: 260 },
      { date: new Date("2026-03-05"), spent: 373, remaining: 290 },
      { date: new Date("2026-03-06"), spent: 301, remaining: 340 },
      { date: new Date("2026-03-07"), spent: 245, remaining: 180 },
      { date: new Date("2026-03-08"), spent: 409, remaining: 320 },
      { date: new Date("2026-03-09"), spent: 59, remaining: 110 },
      { date: new Date("2026-03-10"), spent: 261, remaining: 190 },
      { date: new Date("2026-03-11"), spent: 327, remaining: 350 },
      { date: new Date("2026-03-12"), spent: 292, remaining: 210 },
      { date: new Date("2026-03-13"), spent: 342, remaining: 380 },
      { date: new Date("2026-03-14"), spent: 137, remaining: 220 },
      { date: new Date("2026-03-15"), spent: 120, remaining: 170 },
      { date: new Date("2026-03-16"), spent: 138, remaining: 190 },
      { date: new Date("2026-03-17"), spent: 446, remaining: 360 },
      { date: new Date("2026-03-18"), spent: 364, remaining: 410 },
      { date: new Date("2026-03-19"), spent: 243, remaining: 180 },
      { date: new Date("2026-03-20"), spent: 89, remaining: 150 },
      { date: new Date("2026-03-21"), spent: 137, remaining: 200 },
      { date: new Date("2026-03-22"), spent: 224, remaining: 170 },
      { date: new Date("2026-03-23"), spent: 138, remaining: 230 },
      { date: new Date("2026-03-24"), spent: 387, remaining: 290 },
      { date: new Date("2026-03-25"), spent: 215, remaining: 250 },
      { date: new Date("2026-03-26"), spent: 75, remaining: 130 },
      { date: new Date("2026-03-27"), spent: 383, remaining: 420 },
      { date: new Date("2026-03-28"), spent: 122, remaining: 180 },
      { date: new Date("2026-03-29"), spent: 315, remaining: 240 },
      { date: new Date("2026-03-30"), spent: 454, remaining: 380 },
    ]}
    series={[
      { key: "spent", label: "Spent", color: "var(--destructive)" },
      { key: "remaining", label: "Remaining", color: "var(--primary)" },
    ]}
    ranges={[
      { value: "365d", label: "Last year", days: 365 },
      { value: "180d", label: "Last 6 months", days: 180 },
      { value: "90d", label: "Last 3 months", days: 90 },
      { value: "30d", label: "Last 30 days", days: 30 },
      { value: "7d", label: "Last 7 days", days: 7 },
    ]}
  />
</div>
