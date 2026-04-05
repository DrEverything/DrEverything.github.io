<script lang="ts">
  export let size = undefined;
  export let color = "#000000";
  export let strokeWidth = 2;
  export let background = "transparent";
  export let opacity = 1;
  export let rotation = 0;
  export let shadow = 0;
  export let flipHorizontal = false;
  export let flipVertical = false;
  export let padding = 0;

  $: transforms = [
    rotation !== 0 ? `rotate(${rotation}deg)` : "",
    flipHorizontal ? "scaleX(-1)" : "",
    flipVertical ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  $: viewBoxSize = 24 + padding * 2;
  $: viewBoxOffset = -padding;
  $: viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;
  $: bgColor = background !== "transparent" ? background : undefined;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  {viewBox}
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  style="opacity: {opacity}; transform: {transforms}; {shadow > 0
    ? `filter: drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))`
    : ''}; {bgColor ? `background-color: ${bgColor}` : ''}"
>
  <g fill="none" stroke="currentColor" {strokeWidth}
    ><circle cx="4" cy="4" r="1" transform="rotate(90 4 4)" /><circle
      cx="12"
      cy="4"
      r="1"
      transform="rotate(90 12 4)"
    /><circle cx="20" cy="4" r="1" transform="rotate(90 20 4)" /><circle
      cx="4"
      cy="12"
      r="1"
      transform="rotate(90 4 12)"
    /><circle cx="12" cy="12" r="1" transform="rotate(90 12 12)" /><circle
      cx="20"
      cy="12"
      r="1"
      transform="rotate(90 20 12)"
    /><circle cx="4" cy="20" r="1" transform="rotate(90 4 20)" /><circle
      cx="12"
      cy="20"
      r="1"
      transform="rotate(90 12 20)"
    /><circle cx="20" cy="20" r="1" transform="rotate(90 20 20)" /></g
  >
</svg>
