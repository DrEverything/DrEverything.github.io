<script lang="ts">
  let { calories = 0, target = 2000 }: { calories: number; target: number } = $props();

  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage and clamp it between 0 and 100
  const percentage = $derived(target > 0 ? Math.round((calories / target) * 100) : 0);
  const strokeDashoffset = $derived(target > 0 ? Math.max(0, circumference * (1 - calories / target)) : circumference);
</script>

<div class="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/40 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
  <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calories Consumed</h3>
  
  <div class="relative size-44 flex items-center justify-center">
    <svg class="size-full -rotate-90">
      <circle 
        cx="88" 
        cy="88" 
        r={radius} 
        class="stroke-muted-foreground/10 fill-none" 
        stroke-width="12"
      />
      <circle 
        cx="88" 
        cy="88" 
        r={radius} 
        class="stroke-primary fill-none transition-all duration-500 ease-out" 
        stroke-width="12"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeDashoffset}
      />
    </svg>
    
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span class="text-3xl font-black font-mono leading-none">{Math.round(calories)}</span>
      <span class="text-xs text-muted-foreground font-semibold mt-1">/ {target} kcal</span>
      <span class="text-[10px] font-black text-primary uppercase mt-1 tracking-widest">
        {percentage}%
      </span>
    </div>
  </div>

  <p class="text-xs text-muted-foreground text-center">
    {#if calories <= target}
      You have <span class="font-bold text-foreground">{Math.round(target - calories)} kcal</span> left for today.
    {:else}
      You are <span class="font-bold text-destructive">{Math.round(calories - target)} kcal</span> over your target.
    {/if}
  </p>
</div>
