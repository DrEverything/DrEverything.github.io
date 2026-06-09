<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleUtc } from "d3-scale";
  import { curveNatural } from "d3-shape";
  import { Area, AreaChart, LinearGradient } from "layerchart";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";

  let {
    class: className,
    lowerLimit = 90,
    upperLimit = 160,
    unit = "g/mL",
  }: {
    class?: string;
    lowerLimit?: number;
    upperLimit?: number;
    unit?: string;
  } = $props();

  const chartData = [
    { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
    { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
    { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
    { date: new Date("2024-04-01"), desktop: 73, mobile: 190 },
    { date: new Date("2024-05-01"), desktop: 209, mobile: 130 },
    { date: new Date("2024-06-01"), desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class={className}>
  <Card.Content class="p-0">
    <Chart.Container config={chartConfig}>
      <AreaChart
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        yDomain={[0, Math.max(...chartData.map((d) => d.mobile), upperLimit) * 1.15]}
        padding={{ left: 0, right: 0, top: 20, bottom: 20 }}
        axis={false}
        series={[
          {
            key: "mobile",
            label: "Mobile",
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
                    {unit}
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
            y={context.yScale(upperLimit)}
            width={context.xRange[1] - context.xRange[0]}
            height={context.yScale(lowerLimit) - context.yScale(upperLimit)}
            fill="currentColor"
            class="fill-green-500/10 dark:fill-green-400/10"
          />
          
          <!-- Upper Reference Limit Line -->
          <line
            x1={context.xRange[0]}
            x2={context.xRange[1]}
            y1={context.yScale(upperLimit)}
            y2={context.yScale(upperLimit)}
            stroke="currentColor"
            class="stroke-green-500/30 dark:stroke-green-400/30"
            stroke-dasharray="4 4"
            stroke-width="1"
          />
          <text
            x={context.xRange[1] - 8}
            y={context.yScale(upperLimit) - 4}
            text-anchor="end"
            class="fill-green-600/70 dark:fill-green-400/70 text-[9px] font-medium"
          >
            High: {upperLimit} {unit}
          </text>

          <!-- Lower Reference Limit Line -->
          <line
            x1={context.xRange[0]}
            x2={context.xRange[1]}
            y1={context.yScale(lowerLimit)}
            y2={context.yScale(lowerLimit)}
            stroke="currentColor"
            class="stroke-green-500/30 dark:stroke-green-400/30"
            stroke-dasharray="4 4"
            stroke-width="1"
          />
          <text
            x={context.xRange[1] - 8}
            y={context.yScale(lowerLimit) + 10}
            text-anchor="end"
            class="fill-green-600/70 dark:fill-green-400/70 text-[9px] font-medium"
          >
            Low: {lowerLimit} {unit}
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
