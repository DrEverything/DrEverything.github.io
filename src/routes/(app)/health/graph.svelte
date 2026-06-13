<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleUtc } from "d3-scale";
  import { curveNatural } from "d3-shape";
  import { Area, AreaChart } from "layerchart";
  import type { BloodMarker } from "$lib/types.js";

  let {
    class: className,
    test,
    lowerLimit,
    upperLimit,
    unit,
  }: {
    class?: string;
    test: BloodMarker;
    lowerLimit?: number;
    upperLimit?: number;
    unit?: string;
  } = $props();

  const chartData = $derived(
    test.values.map((v) => ({
      date: new Date(v.date * 1000),
      value: v.number,
    }))
  );

  const activeLowerLimit = $derived(lowerLimit ?? test.lowerLimit ?? 90);
  const activeUpperLimit = $derived(upperLimit ?? test.upperLimit ?? 160);
  const activeUnit = $derived(unit ?? test.unit ?? "g/mL");

  const chartConfig = $derived({
    value: { label: test.name, color: "var(--color-primary)" },
  } satisfies Chart.ChartConfig);
</script>

<Card.Root class={className}>
  <Card.Content class="p-0">
    <Chart.Container config={chartConfig}>
      <AreaChart
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        yDomain={[0, Math.max(...chartData.map((d) => d.value), activeUpperLimit) * 1.15]}
        padding={{ left: 0, right: 0, top: 20, bottom: 20 }}
        axis={false}
        series={[
          {
            key: "value",
            label: test.name,
            color: "var(--color-primary)",
          },
        ]}
        seriesLayout="stack"
      >
        {#snippet tooltip()}
          <Chart.Tooltip
            indicator="dot"
            labelFormatter={(v: Date) => {
              return v.toLocaleDateString("en-US", {
                month: "long",
              });
            }}
          >
            {#snippet formatter({ value, item })}
              <div class="flex items-center gap-1.5">
                <!-- Indicator Dot -->
                <div
                  style="background-color: {item.color || 'var(--color-primary)'};"
                  class="size-2.5 shrink-0 rounded-[2px]"
                ></div>
                <div class="flex items-baseline gap-1 leading-none">
                  <span class="text-foreground font-mono font-semibold tabular-nums text-xs">
                    {Number(value).toLocaleString()}
                  </span>
                  <span class="text-muted-foreground font-medium text-[10px]">
                    {activeUnit}
                  </span>
                </div>
              </div>
            {/snippet}
          </Chart.Tooltip>
        {/snippet}
        {#snippet marks({ context, visibleSeries, getAreaProps })}
          <defs>
            <!-- SVG Glow Filter -->
            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Shaded Reference Range Band -->
          <rect
            x={context.xRange[0]}
            y={context.yScale(activeUpperLimit)}
            width={context.xRange[1] - context.xRange[0]}
            height={context.yScale(activeLowerLimit) - context.yScale(activeUpperLimit)}
            fill="currentColor"
            class="fill-green-500/10 dark:fill-green-400/10"
          />
          
          <!-- Upper Reference Limit Line -->
          <line
            x1={context.xRange[0]}
            x2={context.xRange[1]}
            y1={context.yScale(activeUpperLimit)}
            y2={context.yScale(activeUpperLimit)}
            stroke="currentColor"
            class="stroke-green-500/30 dark:stroke-green-400/30"
            stroke-dasharray="4 4"
            stroke-width="1"
          />
          <text
            x={context.xRange[1] - 8}
            y={context.yScale(activeUpperLimit) - 4}
            text-anchor="end"
            class="fill-green-600/70 dark:fill-green-400/70 text-[9px] font-medium"
          >
            Upper limit: {activeUpperLimit} {activeUnit}
          </text>

          <!-- Lower Reference Limit Line -->
          <line
            x1={context.xRange[0]}
            x2={context.xRange[1]}
            y1={context.yScale(activeLowerLimit)}
            y2={context.yScale(activeLowerLimit)}
            stroke="currentColor"
            class="stroke-green-500/30 dark:stroke-green-400/30"
            stroke-dasharray="4 4"
            stroke-width="1"
          />
          <text
            x={context.xRange[1] - 8}
            y={context.yScale(activeLowerLimit) + 10}
            text-anchor="end"
            class="fill-green-600/70 dark:fill-green-400/70 text-[9px] font-medium"
          >
            Lower limit: {activeLowerLimit} {activeUnit}
          </text>

          {#each visibleSeries as s, i (s.key)}
            <Area
              {...getAreaProps(s, i)}
              curve={curveNatural}
              motion="tween"
              {...s.props}
              fill="none"
              fillOpacity={0}
              line={{
                class: "stroke-primary stroke-3",
                filter: "url(#line-glow)",
              }}
            />
          {/each}
        {/snippet}
      </AreaChart>
    </Chart.Container>
  </Card.Content>
</Card.Root>
