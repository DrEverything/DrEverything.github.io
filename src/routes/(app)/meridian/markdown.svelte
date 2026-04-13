<script lang="ts">
  import { render } from "$lib/markdown";
  import "katex/dist/katex.min.css";
  import "markdown-it-texmath/css/texmath.css";

  let { src }: { src: string } = $props();
  let rendered = $derived(render(src));
</script>

<div class="prose dark:prose-invert max-w-none">{@html rendered}</div>
