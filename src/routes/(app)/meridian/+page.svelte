<script lang="ts">
  import { fly } from 'svelte/transition';
  import * as Card from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';

  type Task = { label: string; tag: string };

  const tasks: Task[] = [
    { label: 'Set up Axum auth middleware', tag: 'backend' },
    { label: 'Design onboarding flow screens', tag: 'design' },
    { label: 'Write Svelte task carousel', tag: 'frontend' },
    { label: 'Configure Cloudflare DNS records', tag: 'infra' },
    { label: 'Draft fitness module data schema', tag: 'backend' },
  ];

  let active = $state(0);
  let dir    = $state(1);

  function move(d: number) {
    dir = d;
    active = Math.max(0, Math.min(tasks.length - 1, active + d));
  }
</script>

<div class="flex flex-col gap-2 overflow-hidden">
  {#each tasks as task, i (task)}
    {@const offset = i - active}
    {#if offset >= 0 && offset < 4}

      <div
        in:fly={{ y: dir * 56, duration: 300, opacity: 0 }}
        out:fly={{ y: -dir * 56, duration: 220, opacity: 0 }}
      >
        <div style="
          opacity: {1 - offset * 0.26};
          transform: scale({1 - offset * 0.07});
          transform-origin: top center;
          transition: opacity 200ms ease, transform 200ms ease;
        ">
          <Card.Root
            class={offset > 0 ? 'cursor-pointer' : ''}
            onclick={() => offset > 0 && move(offset)}
          >
            <Card.Content class="flex items-center justify-between gap-3 p-4">
              <span class={offset === 0 ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
                {task.label}
              </span>
              <Badge variant={offset === 0 ? 'default' : 'secondary'} class="shrink-0">
                {task.tag}
              </Badge>
            </Card.Content>
          </Card.Root>
        </div>
      </div>

    {/if}
  {/each}

  <div class="mt-4 flex gap-2">
    <Button variant="outline" size="sm" onclick={() => move(-1)} disabled={active === 0}>
      ← Back
    </Button>
    <Button variant="outline" size="sm" onclick={() => move(1)} disabled={active >= tasks.length - 1}>
      Complete →
    </Button>
  </div>
</div>
