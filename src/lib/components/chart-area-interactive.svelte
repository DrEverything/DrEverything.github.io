<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { scaleUtc } from "d3-scale";
  import { Area, AreaChart } from "layerchart";
  import { curveNatural, curveMonotoneX } from "d3-shape";

  type DataPoint = { date: Date } & Record<string, number>;

  type SeriesConfig = {
    key: string;
    label: string;
    color: string;
  };

  type TimeRange = {
    value: string;
    label: string;
    days: number;
  };

  type Props = {
    title: string;
    description?: string;
    data: any[];
    series: SeriesConfig[];
    referenceDate?: Date;
    ranges?: TimeRange[];
  };

  const DEFAULT_RANGES: TimeRange[] = [
    { value: "90d", label: "Last 3 months", days: 90 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "7d", label: "Last 7 days", days: 7 },
  ];

  let {
    title,
    description,
    data,
    series,
    referenceDate = new Date(),
    ranges = DEFAULT_RANGES,
  }: Props = $props();

  let timeRange = $derived(ranges[0].value);

  const selectedLabel = $derived(
    ranges.find((r) => r.value === timeRange)?.label ?? ranges[0].label,
  );

  const filteredData = $derived(
    data.filter((item) => {
      const ref = new Date(referenceDate);
      const days = ranges.find((r) => r.value === timeRange)?.days ?? 90;
      ref.setDate(ref.getDate() - days);
      return item.date >= ref;
    }),
  );

  const chartConfig = $derived(
    Object.fromEntries(
      series.map((s) => [s.key, { label: s.label, color: s.color }]),
    ) satisfies Chart.ChartConfig,
  );
</script>

<Card.Root class="@container/card">
  <Card.Header>
    <Card.Title>{title}</Card.Title>
    {#if description}
      <Card.Description>
        <span class="hidden @[540px]/card:block">{description}</span>
        <span class="@[540px]/card:hidden">{description}</span>
      </Card.Description>
    {/if}
    <Card.Action>
      <ToggleGroup.Root
        type="single"
        bind:value={timeRange}
        variant="outline"
        class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
      >
        {#each ranges as r (r.value)}
          <ToggleGroup.Item value={r.value}>{r.label}</ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
      <Select.Root type="single" bind:value={timeRange}>
        <Select.Trigger
          size="sm"
          class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
          aria-label="Select a value"
        >
          <span data-slot="select-value">{selectedLabel}</span>
        </Select.Trigger>
        <Select.Content class="rounded-xl">
          {#each ranges as r (r.value)}
            <Select.Item value={r.value} class="rounded-lg"
              >{r.label}</Select.Item
            >
          {/each}
        </Select.Content>
      </Select.Root>
    </Card.Action>
  </Card.Header>
  <Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
    <Chart.Container config={chartConfig} class="aspect-auto h-[250px] w-full">
      <AreaChart
        legend
        data={filteredData}
        x="date"
        xScale={scaleUtc()}
        {series}
        seriesLayout="stack"
        props={{
          area: {
            curve: curveMonotoneX,
            "fill-opacity": 0.4,
            line: { class: "stroke-1" },
            motion: "tween",
          },
          xAxis: {
            ticks: timeRange === "7d" ? 7 : undefined,
            format: (v: Date) =>
              v.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          },
          yAxis: { format: () => "" },
        }}
      >
        {#snippet marks({ series: activeSeries, getAreaProps })}
          <defs>
            {#each activeSeries as s}
              <linearGradient id="fill-{s.key}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color={s.color} stop-opacity={0.8} />
                <stop offset="95%" stop-color={s.color} stop-opacity={0.1} />
              </linearGradient>
            {/each}
          </defs>
          {#each activeSeries as s, i (s.key)}
            <Area {...getAreaProps(s, i)} fill="url(#fill-{s.key})" />
          {/each}
        {/snippet}
        {#snippet tooltip()}
          <Chart.Tooltip
            labelFormatter={(v: Date) =>
              v.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            indicator="line"
          />
        {/snippet}
      </AreaChart>
    </Chart.Container>
  </Card.Content>
</Card.Root>
