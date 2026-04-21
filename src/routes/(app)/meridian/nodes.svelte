<script lang="ts">
  const nodes = [
    { id: 1, x: 30, y: 30, label: "A" },
    { id: 2, x: 30, y: 100,  label: "B" },
    { id: 3, x: 30, y: 170, label: "C" },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    // { from: 2, to: 3 },
  ];

  function getNode(id: number) {
    return nodes.find(n => n.id === id)!;
  }
</script>

<svg width="400" height="400" class="rounded-xl">
  <!-- Draw edges first (under nodes) -->
  {#each edges as edge}
    {@const a = getNode(edge.from)}
    {@const b = getNode(edge.to)}
    <line
      x1={a.x} y1={a.y}
      x2={b.x} y2={b.y}
      stroke="currentColor"
      stroke-width="1.5"
      class="text-muted-foreground"
    />
  {/each}

  <!-- Draw nodes -->
  {#each nodes as node, index}
    <circle cx={node.x} cy={node.y} r="14" class="fill-primary" />
    <text
      x={node.x} y={node.y}
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-primary-foreground text-sm font-bold"
      font-size="11"
    >
      {index + 1}
    </text>
  {/each}
</svg>
