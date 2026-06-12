<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "$lib/components/ui/table/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleUtc } from "d3-scale";
  import { curveNatural } from "d3-shape";
  import { Area, AreaChart } from "layerchart";
  import type { LabTest } from "$lib/types.js";
  import ArrowUpIcon from "@tabler/icons-svelte/icons/arrow-up";
  import ArrowDownIcon from "@tabler/icons-svelte/icons/arrow-down";
  import CheckIcon from "@tabler/icons-svelte/icons/check";

  let {
    open = $bindable(false),
    test,
  }: {
    open: boolean;
    test: LabTest;
  } = $props();

  const chartData = $derived(
    test.past_values.map((v) => ({
      date: new Date(v.date * 1000),
      value: v.number,
    }))
  );

  const hasLimits = $derived(test.lowerLimit !== undefined || test.upperLimit !== undefined);
  const lowerLimit = $derived(test.lowerLimit ?? 0);
  const upperLimit = $derived(test.upperLimit ?? 0);
  const unit = $derived(test.unit ?? "");

  // Reverse past values for the table view (newest first)
  const reversedValues = $derived([...test.past_values].sort((a, b) => b.date - a.date));

  // Determine status of a specific value
  function getValueStatus(val: number) {
    if (test.lowerLimit !== undefined && val < test.lowerLimit) return "low";
    if (test.upperLimit !== undefined && val > test.upperLimit) return "high";
    return "normal";
  }

  // Format date utility
  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const chartConfig = $derived({
    value: { label: test.name, color: "var(--primary)" },
  } satisfies Chart.ChartConfig);

  // Y-axis bounds configuration - defined cleanly as a derived array
  const yDomain = $derived.by(() => {
    const values = test.past_values.map((d) => d.number);
    const maxVal = Math.max(...values, test.upperLimit ?? 0);
    const minVal = Math.min(...values, test.lowerLimit ?? 0);
    const range = maxVal - minVal;
    return [
      Math.max(0, minVal - (range || minVal) * 0.15),
      maxVal + (range || maxVal) * 0.15
    ] as [number, number];
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-2xl sm:max-w-3xl overflow-y-auto max-h-[90vh] p-6 rounded-2xl">
    <Dialog.Header class="text-left">
      <Dialog.Title class="text-2xl font-bold flex items-baseline gap-2">
        {test.name}
        {#if unit}
          <span class="text-sm font-normal text-muted-foreground font-mono">({unit})</span>
        {/if}
      </Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground mt-1 leading-relaxed">
        {test.description}
      </Dialog.Description>
    </Dialog.Header>

    <div class="mt-6 space-y-6">
      <!-- Reference Range Info Banner -->
      {#if hasLimits}
        <div class="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 border text-center">
          <div>
            <span class="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lower Limit</span>
            <span class="text-lg font-bold font-mono text-foreground mt-0.5 block">
              {test.lowerLimit !== undefined ? `${test.lowerLimit} ${unit}` : "N/A"}
            </span>
          </div>
          <div class="border-x border-border">
            <span class="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Normal Range</span>
            <span class="text-xs text-muted-foreground mt-1 block px-2 py-0.5 rounded bg-green-500/10 text-green-500 dark:text-green-400 max-w-fit mx-auto font-medium">
              {test.lowerLimit !== undefined && test.upperLimit !== undefined
                ? `${test.lowerLimit} - ${test.upperLimit} ${unit}`
                : "Standard range"}
            </span>
          </div>
          <div>
            <span class="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Upper Limit</span>
            <span class="text-lg font-bold font-mono text-foreground mt-0.5 block">
              {test.upperLimit !== undefined ? `${test.upperLimit} ${unit}` : "N/A"}
            </span>
          </div>
        </div>
      {/if}

      <!-- Detailed Progression Chart -->
      <div class="border rounded-2xl p-4 bg-muted/10 relative overflow-hidden h-[240px]">
        {#if test.past_values.length > 0}
          <div class="absolute inset-0 p-4">
            <Chart.Container config={chartConfig} class="aspect-auto h-full w-full">
              <AreaChart
                data={chartData}
                x="date"
                xScale={scaleUtc()}
                yDomain={yDomain}
                padding={{ left: 10, right: 10, top: 20, bottom: 20 }}
                axis={false}
                series={[
                  {
                    key: "value",
                    label: test.name,
                    color: "var(--primary)",
                  },
                ]}
              >
                {#snippet tooltip()}
                  <Chart.Tooltip
                    indicator="dot"
                    labelFormatter={(v: Date) => {
                      return v.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                  >
                    {#snippet formatter({ value, item })}
                      <div class="flex items-center gap-1.5">
                        <div
                          style="background-color: {item.color || 'var(--primary)'};"
                          class="size-2.5 shrink-0 rounded-[2px]"
                        ></div>
                        <div class="flex items-baseline gap-1 leading-none">
                          <span class="text-foreground font-mono font-semibold tabular-nums text-xs">
                            {Number(value).toLocaleString()}
                          </span>
                          <span class="text-muted-foreground font-medium text-[10px]">
                            {unit}
                          </span>
                        </div>
                      </div>
                    {/snippet}
                  </Chart.Tooltip>
                {/snippet}

                {#snippet marks({ context, visibleSeries, getAreaProps })}
                  <!-- Reference Range Shading -->
                  {#if test.lowerLimit !== undefined && test.upperLimit !== undefined}
                    <rect
                      x={context.xRange[0]}
                      y={context.yScale(test.upperLimit)}
                      width={context.xRange[1] - context.xRange[0]}
                      height={context.yScale(test.lowerLimit) - context.yScale(test.upperLimit)}
                      fill="currentColor"
                      class="fill-green-500/5 dark:fill-green-400/5"
                    />
                    <!-- Upper limit dashline -->
                    <line
                      x1={context.xRange[0]}
                      x2={context.xRange[1]}
                      y1={context.yScale(test.upperLimit)}
                      y2={context.yScale(test.upperLimit)}
                      stroke="currentColor"
                      class="stroke-green-500/20 dark:stroke-green-400/20"
                      stroke-dasharray="4 4"
                      stroke-width="1"
                    />
                    <!-- Lower limit dashline -->
                    <line
                      x1={context.xRange[0]}
                      x2={context.xRange[1]}
                      y1={context.yScale(test.lowerLimit)}
                      y2={context.yScale(test.lowerLimit)}
                      stroke="currentColor"
                      class="stroke-green-500/20 dark:stroke-green-400/20"
                      stroke-dasharray="4 4"
                      stroke-width="1"
                    />
                  {/if}

                  {#each visibleSeries as s, i (s.key)}
                    <Area
                      {...getAreaProps(s, i)}
                      curve={curveNatural}
                      motion="tween"
                      {...s.props}
                      fill="none"
                      fillOpacity={0}
                      line={{
                        class: "stroke-[2.5]",
                        style: "stroke: var(--primary);",
                      }}
                    />
                  {/each}
                {/snippet}
              </AreaChart>
            </Chart.Container>
          </div>
        {:else}
          <div class="h-full flex items-center justify-center text-sm text-muted-foreground">
            No historical recordings found.
          </div>
        {/if}
      </div>

      <!-- Historical Log Table -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold tracking-tight text-foreground uppercase tracking-wider text-muted-foreground">Historical Logs</h3>
        <div class="border rounded-2xl overflow-hidden bg-card">
          <Table>
            <TableHeader class="bg-muted/30">
              <TableRow>
                <TableHead class="h-10 text-xs">Date</TableHead>
                <TableHead class="h-10 text-xs text-right">Value</TableHead>
                <TableHead class="h-10 text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each reversedValues as entry}
                {@const status = getValueStatus(entry.number)}
                <TableRow class="hover:bg-muted/10 transition-colors">
                  <TableCell class="py-2.5 font-medium text-sm text-muted-foreground font-mono">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell class="py-2.5 text-right font-mono font-semibold text-sm">
                    {entry.number} <span class="text-xs text-muted-foreground font-normal">{unit}</span>
                  </TableCell>
                  <TableCell class="py-2.5 text-right">
                    <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                      {status === 'low' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
                      {status === 'high' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
                      {status === 'normal' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                    ">
                      {#if status === 'low'}
                        <ArrowDownIcon class="size-3" /> Low
                      {:else if status === 'high'}
                        <ArrowUpIcon class="size-3" /> High
                      {:else}
                        <CheckIcon class="size-3" /> In Range
                      {/if}
                    </span>
                  </TableCell>
                </TableRow>
              {/each}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
