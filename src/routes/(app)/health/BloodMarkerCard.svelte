<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleUtc } from "d3-scale";
  import { curveNatural } from "d3-shape";
  import { Area, AreaChart } from "layerchart";
  import type { BloodMarker } from "$lib/types.js";
  import ArrowUpIcon from "@tabler/icons-svelte/icons/arrow-up";
  import ArrowDownIcon from "@tabler/icons-svelte/icons/arrow-down";
  import CheckIcon from "@tabler/icons-svelte/icons/check";
  import BloodMarkerDetails from "./BloodMarkerDetails.svelte";

  let {
    test,
  }: {
    test: BloodMarker;
  } = $props();

  let detailsOpen = $state(false);

  const values = $derived(test.values.map((v) => v.number));
  const latestValue = $derived(test.values[test.values.length - 1]?.number ?? 0);

  // Determine status
  const status = $derived(
    latestValue < test.lowerLimit ? "low" :
    latestValue > test.upperLimit ? "high" : "normal"
  );

  const statusLabel = $derived(
    status === "low" ? "Low" :
    status === "high" ? "High" : "Normal"
  );

  const statusColorClass = $derived(
    status === "low" ? "text-warning bg-warning/10 border-warning/20" :
    status === "high" ? "text-destructive bg-destructive/10 border-destructive/20" :
    "text-success bg-success/10 border-success/20"
  );

  // Safe color values for chart rendering
  const strokeColor = $derived(
    status === "low" ? "var(--warning)" :
    status === "high" ? "var(--destructive)" :
    "var(--success)"
  );

  // Compute gauge range percentages
  const gaugeMetrics = $derived.by(() => {
    const allVals = [...values, test.lowerLimit, test.upperLimit];

    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);
    const range = maxVal - minVal;

    // Pad slightly so points aren't clipped at absolute edges
    const padding = (range || Math.abs(minVal) || 1) * 0.15;
    const visualMin = minVal - padding;
    const visualMax = maxVal + padding;
    const visualRange = visualMax - visualMin || 1;

    const getPercent = (v: number) => {
      const pct = ((v - visualMin) / visualRange) * 100;
      return Math.max(0, Math.min(100, pct));
    };

    const latestPct = getPercent(latestValue);
    const lowerPct = getPercent(test.lowerLimit);
    const upperPct = getPercent(test.upperLimit);

    return {
      latestPct,
      lowerPct,
      upperPct,
    };
  });

  // Sparkline data
  const chartData = $derived(
    test.values.map((v) => ({
      date: new Date(v.date * 1000),
      value: v.number,
    }))
  );

  const chartConfig = $derived({
    value: { label: test.name, color: strokeColor },
  } satisfies Chart.ChartConfig);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<Card.Root
  onclick={() => (detailsOpen = true)}
  class="group relative overflow-hidden bg-card hover:bg-muted/10 border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-2xl cursor-pointer flex flex-col gap-0 p-0 h-[260px]"
>
  <Card.Header class="p-5 pb-2 flex flex-row justify-between items-start space-y-0 gap-2 h-[105px] shrink-0">
    <div class="space-y-1">
      <h3 class="font-bold text-sm leading-tight text-foreground tracking-tight group-hover:text-primary transition-colors">
        {test.name}
      </h3>
      <p class="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
        {test.description}
      </p>
    </div>

    <!-- Status Badge -->
    <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 {statusColorClass}">
      {#if status === 'low'}
        <ArrowDownIcon class="size-3" />
      {:else if status === 'high'}
        <ArrowUpIcon class="size-3" />
      {:else}
        <CheckIcon class="size-3" />
      {/if}
      {statusLabel}
    </span>
  </Card.Header>

  <Card.Content class="px-5 py-2 flex-grow flex flex-col justify-end gap-3 min-h-[95px] shrink-0">
    <!-- Value Display -->
    <div class="flex items-baseline gap-1">
      <span class="text-3xl font-extrabold font-mono tracking-tight text-foreground">
        {latestValue}
      </span>
    </div>

    <!-- Reference Range Slider / Gauge -->
    <div class="space-y-1 w-full">
      <div class="relative w-full h-1.5 bg-muted rounded-full overflow-visible">
        <!-- Highlighted Normal Range segment -->
        <div
          class="absolute top-0 bottom-0 bg-success/20 rounded-full"
          style="left: {gaugeMetrics.lowerPct}%; width: {gaugeMetrics.upperPct - gaugeMetrics.lowerPct}%;"
        ></div>

        <!-- Indicator dot for the latest value -->
        <div
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full border border-background shadow-sm transition-all duration-300
            {status === 'low' ? 'bg-warning' : ''}
            {status === 'high' ? 'bg-destructive' : ''}
            {status === 'normal' ? 'bg-success' : ''}
          "
          style="left: {gaugeMetrics.latestPct}%;"
        ></div>
      </div>

      <!-- Reference Limit Labels -->
      <div class="flex justify-between text-[9px] text-muted-foreground font-semibold font-mono tracking-wider font-semibold">
        <span>{test.lowerLimit}</span>
        <span>{test.upperLimit}</span>
      </div>
    </div>
  </Card.Content>

  <!-- Sparkline at the bottom of the card -->
  <div class="w-full h-12 relative overflow-hidden bg-muted/5 border-t border-muted/20 pointer-events-none">
    {#if chartData.length > 1}
      <div class="absolute inset-0 top-1">
        <Chart.Container config={chartConfig} class="aspect-auto h-full w-full">
          <AreaChart
            data={chartData}
            x="date"
            xScale={scaleUtc()}
            yDomain={[Math.min(...values) * 0.95, Math.max(...values) * 1.05]}
            padding={{ left: 0, right: 0, top: 2, bottom: 2 }}
            axis={false}
            series={[
              {
                key: "value",
                label: test.name,
                color: strokeColor,
              },
            ]}
          >
            {#snippet marks({ context, visibleSeries, getAreaProps })}
              {#each visibleSeries as s, i (s.key)}
                <Area
                  {...getAreaProps(s, i)}
                  curve={curveNatural}
                  motion="tween"
                  {...s.props}
                  fill="none"
                  fillOpacity={0}
                  line={{
                    class: "stroke-[2]",
                    style: `stroke: ${strokeColor}; opacity: 0.8;`,
                  }}
                />
              {/each}
            {/snippet}
          </AreaChart>
        </Chart.Container>
      </div>
    {:else}
      <div class="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
        Single recording
      </div>
    {/if}
  </div>
</Card.Root>

<!-- Detail view dialog -->
{#if detailsOpen}
  <BloodMarkerDetails bind:open={detailsOpen} {test} />
{/if}
