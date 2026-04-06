<script lang="ts">
  import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
  import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  export type StatCard = {
    label: string;
    value: number;
    previousValue?: number;
    format?: (v: number) => string;
    description?: string;
  };

  let { cards }: { cards: StatCard[] } = $props();

  function trend(card: StatCard): { up: boolean; pct: string } | null {
    if (card.previousValue === undefined) return null;
    if (card.previousValue === 0) return null;
    const diff =
      ((card.value - card.previousValue) / Math.abs(card.previousValue)) * 100;
    return { up: diff >= 0, pct: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%` };
  }

  function display(card: StatCard): string {
    return card.format ? card.format(card.value) : card.value.toLocaleString();
  }
</script>

<div
  class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
>
  {#each cards as card}
    {@const t = trend(card)}
    <Card.Root class="@container/card">
      <Card.Header>
        <Card.Description>{card.label}</Card.Description>
        <Card.Title
          class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
        >
          {display(card)}
        </Card.Title>
        {#if t}
          <Card.Action>
            <Badge variant="outline">
              {#if t.up}
                <TrendingUpIcon />
              {:else}
                <TrendingDownIcon />
              {/if}
              {t.pct}
            </Badge>
          </Card.Action>
        {/if}
      </Card.Header>
      {#if card.description || t}
        <Card.Footer class="flex-col items-start gap-1.5 text-sm">
          {#if t}
            <div class="line-clamp-1 flex gap-2 font-medium">
              {t.up ? "Trending up" : "Trending down"}
              {#if t.up}
                <TrendingUpIcon class="size-4" />
              {:else}
                <TrendingDownIcon class="size-4" />
              {/if}
            </div>
          {/if}
          {#if card.description}
            <div class="text-muted-foreground">{card.description}</div>
          {/if}
        </Card.Footer>
      {/if}
    </Card.Root>
  {/each}
</div>
