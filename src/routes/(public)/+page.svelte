<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  // Mockup datasets for the interactive result card
  const mockupData = {
    ferritin: {
      name: "Ferritin · iron stores",
      value: "38",
      unit: "µg/L",
      verdict: "Lab verdict: within range · not flagged",
      monada: "Monada: ↓ 58% below your baseline",
      baselineLabel: "YOUR BASELINE · 90",
      baselineY: 92,
      path: "M120,90 L350,106 L585,138 L760,168",
      points: [
        { cx: 120, cy: 90, r: 4 },
        { cx: 350, cy: 106, r: 4 },
        { cx: 585, cy: 138, r: 4 },
        { cx: 760, cy: 168, r: 6 }
      ],
      rangeLabel: "POPULATION NORMAL · 30–300 µg/L",
      rangeY: 70,
      rangeH: 150,
      interpretation: "Your iron stores have fallen by more than half since January. You are still inside the lab's normal range, so a standard screen would not mention it, but a drop this steep against your own history is worth acting on. We would recheck in 6 weeks and look at your training load and diet over the same period."
    },
    apob: {
      name: "Apolipoprotein B (ApoB)",
      value: "1.15",
      unit: "g/L",
      verdict: "Lab verdict: within range · not flagged",
      monada: "Monada: ↑ 62% above your baseline",
      baselineLabel: "YOUR BASELINE · 0.71",
      baselineY: 202,
      path: "M120,200 L350,205 L585,202 L760,82",
      points: [
        { cx: 120, cy: 200, r: 4 },
        { cx: 350, cy: 205, r: 4 },
        { cx: 585, cy: 202, r: 4 },
        { cx: 760, cy: 82, r: 6 }
      ],
      rangeLabel: "POPULATION NORMAL · 0.6–1.2 g/L",
      rangeY: 75,
      rangeH: 145,
      interpretation: "Your ApoB has jumped significantly in the last 2 months. While still theoretically in the 'normal' lab reference range, a shift this rapid suggests an increase in atherogenic particle count. We suggest looking at dietary saturated fat intake and repeating the test in 4 weeks."
    },
    vitamind: {
      name: "Vitamin D (25-OH)",
      value: "112",
      unit: "nmol/L",
      verdict: "Lab verdict: deficient · flagged low",
      monada: "Monada: ↑ 103% above your baseline",
      baselineLabel: "YOUR BASELINE · 55",
      baselineY: 205,
      path: "M120,205 L350,182 L585,160 L760,105",
      points: [
        { cx: 120, cy: 205, r: 4 },
        { cx: 350, cy: 182, r: 4 },
        { cx: 585, cy: 160, r: 4 },
        { cx: 760, cy: 105, r: 6 }
      ],
      rangeLabel: "POPULATION NORMAL · 75–150 nmol/L",
      rangeY: 60,
      rangeH: 110,
      interpretation: "Your Vitamin D levels have successfully climbed from deficient (55 nmol/L) to an optimal baseline (112 nmol/L) over 9 months. Your current supplementation protocol is effective. We recommend maintaining this maintenance dose through the winter months."
    }
  };

  let selectedTab = $state<'ferritin' | 'apob' | 'vitamind'>('ferritin');
  const activeData = $derived(mockupData[selectedTab]);
  const lastPoint = $derived(activeData.points[activeData.points.length - 1]);
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,400;1,9..144,500&display=swap"
    rel="stylesheet"
  />
  <title>Monada — your baseline, not the average</title>
  <meta
    name="description"
    content="Standard bloodwork compares you to strangers. Monada compares you to you, and watches what changes over time."
  />
</svelte:head>

<div class="relative overflow-hidden min-h-screen bg-background text-foreground antialiased">
  <!-- HEADER -->
  <header class="border-b border-border/60 relative z-10">
    <div class="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-8">
      <span class="font-mono text-[13px] font-medium tracking-[0.35em]">
        MONADA<span class="text-primary">.</span>
      </span>
      <span class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        Personal biological intelligence
      </span>
    </div>
  </header>

  <main class="mx-auto max-w-[1040px] px-8 relative z-10">
    <!-- HERO -->
    <section class="pb-16 pt-[88px]">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
        Your baseline · not the average
      </p>
      <h1 class="serif mt-6 max-w-[14ch] text-balance leading-[1.02] tracking-[-0.02em]">
        Your body is not a <em class="text-primary">population.</em>
      </h1>
      <p class="mt-7 max-w-[52ch] text-[19px] text-muted-foreground leading-relaxed">
        Standard bloodwork compares you to strangers and calls you normal. Monada compares you to
        you, and watches what changes over time.
      </p>

      <p class="mt-6 max-w-[52ch] text-[15px] leading-[1.6] text-foreground/80">
        You get a blood draw, then a personal report in your dashboard within 48 hours: every marker
        plotted against your own history, in plain language, with what changed and why it matters.
      </p>

      <Button href="/health" size="lg" class="mt-9 h-auto gap-2.5 px-6 py-3.5 text-[15px] hover:scale-102 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
        Start your baseline
        <svg
          class="size-4 transition-transform group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Button>

      <p class="mt-5 max-w-[48ch] font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-muted-foreground">
        Blood analysed by certified EU laboratory partners. Your data is encrypted, never sold, and
        yours to export or delete at any time.
      </p>
    </section>

    <!-- INTERACTIVE MOCKUP SECTION -->
    <section class="border-t border-border/60 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        Interactive Deliverable
      </p>
      <h2 class="serif mt-4 max-w-[20ch] leading-[1.08] tracking-[-0.02em]">
        One marker, read the way it should be.
      </h2>
      <p class="mt-5 max-w-[58ch] text-[18px] text-muted-foreground">
        Select a biomarker below to see how Monada tracks your personal baseline and alerts you to meaningful biological shifts.
      </p>

      <!-- Biomarker Tab Selector Buttons -->
      <div class="mt-10 flex flex-wrap gap-2.5 border-b border-border/40 pb-5">
        <button
          onclick={() => (selectedTab = "ferritin")}
          class={cn(
            "px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer select-none",
            selectedTab === "ferritin"
              ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          Ferritin (Iron)
        </button>
        <button
          onclick={() => (selectedTab = "apob")}
          class={cn(
            "px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer select-none",
            selectedTab === "apob"
              ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          Apolipoprotein B (ApoB)
        </button>
        <button
          onclick={() => (selectedTab = "vitamind")}
          class={cn(
            "px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer select-none",
            selectedTab === "vitamind"
              ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          Vitamin D
        </button>
      </div>

      <!-- THE RESULT CARD MOCKUP WITH KEY RE-ANIMATION -->
      <figure class="mt-6 overflow-hidden rounded-2xl border border-border bg-card/45 backdrop-blur-sm shadow-xl relative">
        <div>
          <!-- Card Header -->
          <div class="flex flex-col gap-3 border-b border-border/60 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span class="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {activeData.name}
              </span>
              <div class="mt-1.5 flex items-baseline gap-2">
                <span class="serif text-[32px] leading-none tracking-[-0.01em] font-bold">
                  {activeData.value}
                </span>
                <span class="font-mono text-[13px] text-muted-foreground">
                  {activeData.unit}
                </span>
              </div>
            </div>
            <!-- Dynamic Badges -->
            <div class="flex flex-col gap-2 sm:items-end">
              <span class="w-fit rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
                {activeData.verdict}
              </span>
              <span class="w-fit rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-primary"
                style="background: color-mix(in oklch, var(--primary) 12%, transparent)"
              >
                {activeData.monada}
              </span>
            </div>
          </div>

          <!-- The SVG Chart Area -->
          <div class="px-7 pb-2 pt-7 relative overflow-hidden h-[260px]">
            {#key selectedTab}
              <svg
                viewBox="0 0 860 260"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Interactive biological trend graph"
              >
                <!-- Reference normal range band -->
                <rect x="60" y={activeData.rangeY} width="760" height={activeData.rangeH} class="fill-foreground/[0.04]" />
                <line
                  x1="60"
                  y1={activeData.rangeY}
                  x2="820"
                  y2={activeData.rangeY}
                  class="stroke-border"
                  stroke-dasharray="3 4"
                />
                <line
                  x1="60"
                  y1={activeData.rangeY + activeData.rangeH}
                  x2="820"
                  y2={activeData.rangeY + activeData.rangeH}
                  class="stroke-border"
                  stroke-dasharray="3 4"
                />
                <text x="68" y={activeData.rangeY - 8} class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold"
                  >{activeData.rangeLabel}</text
                >

                <!-- Personal Baseline Line -->
                <line
                  x1="60"
                  y1={activeData.baselineY}
                  x2="820"
                  y2={activeData.baselineY}
                  class="stroke-primary/30"
                  stroke-dasharray="2 6"
                />
                <text
                  x="812"
                  y={activeData.baselineY - 6}
                  class="fill-primary/70 font-mono text-[9px] tracking-[1px] font-semibold"
                  text-anchor="end"
                >
                  {activeData.baselineLabel}
                </text>

                <!-- Drawing trend line path -->
                <path
                  d={activeData.path}
                  fill="none"
                  class="stroke-primary trace"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- Data point markers -->
                <g class="animate-fade-in">
                  {#each activeData.points as point}
                    <circle cx={point.cx} cy={point.cy} r={point.r} class="fill-primary" />
                  {/each}
                  <circle cx={lastPoint.cx} cy={lastPoint.cy} r="11" fill="none" class="stroke-primary/45 animate-pulse-ring" />
                </g>

                <!-- X-Axis timeline labels -->
                <text x="120" y="244" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold" text-anchor="middle">JAN</text>
                <text x="350" y="244" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold" text-anchor="middle">APR</text>
                <text x="585" y="244" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold" text-anchor="middle">JUL</text>
                <text x="760" y="244" class="fill-primary font-mono text-[9px] tracking-[1px] font-bold" text-anchor="middle">OCT</text>
              </svg>
            {/key}
          </div>
        </div>

        <!-- Plain language interpretation -->
        <figcaption class="border-t border-border/60 px-7 py-5">
          <p class="text-[15px] leading-[1.65] text-foreground/85">
            {activeData.interpretation}
          </p>
        </figcaption>
      </figure>

      <p class="mt-6 max-w-[58ch] text-[14px] text-muted-foreground">
        Your full report has one of these for every marker in your panel. The interpretation gets
        sharper with each draw, because it is reading more of your own history.
      </p>
    </section>

    <!-- THE BLIND SPOT -->
    <section class="border-t border-border/60 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        The blind spot
      </p>
      <h2 class="serif mt-4 max-w-[20ch] leading-[1.08] tracking-[-0.02em]">
        The healthier you are, the better your disease hides.
      </h2>
      <p class="mt-5 max-w-[60ch] text-[18px] text-muted-foreground leading-relaxed">
        Two people experience the exact same biological drop. Only the one with unhealthy habits gets
        caught because they are already near the edge of the range. The person with a healthy lifestyle
        remains within the "normal" population range and is dismissed, even though they are undergoing the
        same decline.
      </p>

      <div class="mt-12 grid gap-4.5">
        <!-- Patient with unhealthy habits -->
        <div class="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border px-5 py-5 sm:grid-cols-[160px_1fr_150px] bg-card/10 hover:bg-card/20 transition-all duration-100">
          <div class="text-[15px] font-semibold">
            Unhealthy habits
            <small class="mt-1 block text-[11px] text-muted-foreground leading-normal font-sans">
              Drinks, smokes, sedentary, poor diet
            </small>
            <small class="mt-1 block font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              13 → 8 · Δ −5
            </small>
          </div>
          <svg viewBox="0 0 520 96" width="100%" height="84" preserveAspectRatio="none">
            <rect x="0" y="20" width="520" height="44" class="fill-foreground/[0.05]" />
            <line
              x1="0"
              y1="64"
              x2="520"
              y2="64"
              class="stroke-muted-foreground/30"
              stroke-dasharray="3 4"
            />
            <text x="6" y="14" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold">NORMAL RANGE</text>
            <text x="455" y="80" class="fill-primary font-mono text-[9px] tracking-[1px] font-bold">↓ BELOW</text>
            <line
              x1="70"
              y1="52"
              x2="310"
              y2="82"
              class="stroke-primary"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <circle cx="70" cy="52" r="3.5" class="fill-primary" />
            <circle cx="310" cy="82" r="5" class="fill-primary" />
          </svg>
          <div class="text-left font-mono text-[12px] tracking-[0.04em] text-primary sm:text-right font-bold">
            ▶ FLAGGED · TREATED
          </div>
        </div>

        <!-- Patient with healthy lifestyle -->
        <div class="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border px-5 py-5 sm:grid-cols-[160px_1fr_150px] bg-card/10 hover:bg-card/20 transition-all duration-100">
          <div class="text-[15px] font-semibold">
            Healthy lifestyle
            <small class="mt-1 block text-[11px] text-muted-foreground leading-normal font-sans">
              Active & clean nutrition
            </small>
            <small class="mt-1 block font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              25 → 20 · Δ −5
            </small>
          </div>
          <svg viewBox="0 0 520 96" width="100%" height="84" preserveAspectRatio="none">
            <rect x="0" y="20" width="520" height="44" class="fill-foreground/[0.05]" />
            <line
              x1="0"
              y1="64"
              x2="520"
              y2="64"
              class="stroke-muted-foreground/30"
              stroke-dasharray="3 4"
            />
            <text x="6" y="14" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold">NORMAL RANGE</text>
            <text x="430" y="42" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold">STILL INSIDE</text>
            <line
              x1="70"
              y1="26"
              x2="310"
              y2="56"
              class="stroke-primary"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <circle cx="70" cy="26" r="3.5" class="fill-primary" />
            <circle cx="310" cy="56" r="5" class="fill-primary" />
          </svg>
          <div class="text-left font-mono text-[12px] tracking-[0.04em] text-muted-foreground sm:text-right font-semibold">
            — "NORMAL" · DISMISSED
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT WE MAKE VISIBLE -->
    <section class="border-t border-border/60 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        What we make visible
      </p>
      <h2 class="serif mt-4 leading-[1.08] tracking-[-0.02em]">
        Three readings, all measured against you.
      </h2>

      <div class="mt-13 grid gap-6 md:grid-cols-3">
        <!-- Blood card -->
        <div class="flex min-h-[250px] flex-col rounded-2xl border border-border px-5 py-6 bg-card/10 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
          <span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-bold">Blood</span>
          <h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em] font-semibold">Your history, not theirs</h3>
          <p class="mt-2.5 text-[14px] leading-[1.6] text-muted-foreground">
            Every biomarker is plotted against your own past results. A change the population range
            will never flag is obvious the moment it bends away from your line.
          </p>
          <div class="mt-auto pt-6">
            <svg viewBox="0 0 240 56" width="100%" height="56">
              <rect x="0" y="14" width="240" height="28" class="fill-foreground/[0.04]" />
              <path
                d="M6,28 L40,27 L74,29 L108,26 L142,30 L176,40 L210,49 L234,52"
                fill="none"
                class="stroke-primary trace"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle cx="234" cy="52" r="3.5" class="fill-primary" />
            </svg>
          </div>
        </div>

        <!-- Training card -->
        <div class="flex min-h-[250px] flex-col rounded-2xl border border-border px-5 py-6 bg-card/10 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
          <span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-bold">Training</span>
          <h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em] font-semibold">See the wall early</h3>
          <p class="mt-2.5 text-[14px] leading-[1.6] text-muted-foreground">
            We project where your current training stops paying off, before you hit it, so you change
            the stimulus in time instead of grinding months into a plateau.
          </p>
          <div class="mt-auto pt-6">
            <svg viewBox="0 0 240 56" width="100%" height="56">
              <path
                d="M6,50 C60,50 120,18 150,16 C190,13 220,13 234,13"
                fill="none"
                class="stroke-primary trace"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="150"
                y1="8"
                x2="150"
                y2="52"
                class="stroke-primary/30"
                stroke-dasharray="2 4"
              />
              <circle cx="150" cy="16" r="3.5" class="fill-primary" />
            </svg>
          </div>
        </div>

        <!-- Nutrition card -->
        <div class="flex min-h-[250px] flex-col rounded-2xl border border-border px-5 py-6 bg-card/10 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
          <span class="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-bold">Nutrition</span>
          <h3 class="serif mt-3.5 text-[20px] tracking-[-0.01em] font-semibold">What you absorb</h3>
          <p class="mt-2.5 text-[14px] leading-[1.6] text-muted-foreground">
            Tracked on what your body actually takes up, not what the label claims, with an honest
            projection of where your current eating is taking you.
          </p>
          <div class="mt-auto pt-6">
            <svg viewBox="0 0 240 56" width="100%" height="56">
              <rect x="6" y="14" width="150" height="12" rx="3" class="fill-muted" />
              <rect x="6" y="14" width="96" height="12" rx="3" class="fill-primary" />
              <text x="6" y="46" class="fill-muted-foreground font-mono text-[9px] tracking-[1px] font-semibold"
                >RAW 150g · ABSORBED 96g</text
              >
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="border-t border-border/60 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        How it works
      </p>
      <h2 class="serif mt-4 leading-[1.08] tracking-[-0.02em]">
        Four steps. Then it runs on your data.
      </h2>
      <ol class="mt-13 border-t border-border/60">
        <li class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr] hover:bg-muted/5 px-2 rounded-xl transition-all duration-200">
          <span class="font-mono text-[13px] tracking-[0.1em] text-primary font-bold">01</span>
          <span class="serif text-[19px] tracking-[-0.01em] font-semibold">Draw</span>
          <span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
            >At home, or at the nearest partner lab. You choose.</span
          >
        </li>
        <li class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr] hover:bg-muted/5 px-2 rounded-xl transition-all duration-200">
          <span class="font-mono text-[13px] tracking-[0.1em] text-primary font-bold">02</span>
          <span class="serif text-[19px] tracking-[-0.01em] font-semibold">Baseline</span>
          <span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
            >Your personal reference is built from your own results, not a population chart.</span
          >
        </li>
        <li class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr] hover:bg-muted/5 px-2 rounded-xl transition-all duration-200">
          <span class="font-mono text-[13px] tracking-[0.1em] text-primary font-bold">03</span>
          <span class="serif text-[19px] tracking-[-0.01em] font-semibold">Track</span>
          <span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
            >Every new result is plotted against your history, so deviation shows immediately.</span
          >
        </li>
        <li class="grid grid-cols-[48px_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border/60 py-6 sm:grid-cols-[64px_200px_1fr] hover:bg-muted/5 px-2 rounded-xl transition-all duration-200">
          <span class="font-mono text-[13px] tracking-[0.1em] text-primary font-bold">04</span>
          <span class="serif text-[19px] tracking-[-0.01em] font-semibold">Optimize</span>
          <span class="col-span-2 max-w-[46ch] text-[15px] text-muted-foreground sm:col-span-1"
            >Training and nutrition adjust to what your biology actually shows, not guesswork.</span
          >
        </li>
      </ol>
    </section>

    <!-- WHY THIS EXISTS -->
    <section class="border-t border-border/60 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        Why this exists
      </p>
      <blockquote class="serif mt-6 max-w-[34ch] text-[26px] leading-[1.18] tracking-[-0.01em] font-semibold">
        I spent years being told my numbers were
        <em class="text-primary">normal</em> while I knew my own body was telling a different story.
      </blockquote>
      <p class="mt-6 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
        Monada is built by one person who got tired of medicine that compares you to strangers. No
        investors steering it, no data sold to anyone. The early users are talked to directly, and the
        product is shaped by what they actually need.
      </p>
    </section>
  </main>

  <!-- CLOSE / BOTTOM CTA -->
  <section class="border-t border-border/60 px-8 pb-32 pt-30 text-center relative z-10">
    <div class="relative z-10">
      <h2 class="serif mx-auto max-w-[18ch] leading-[1.08] tracking-[-0.02em]">
        Medicine built on averages cannot see you. <em class="text-primary">This can.</em>
      </h2>
      <p class="mt-6 font-mono text-[14px] text-muted-foreground uppercase tracking-wider font-semibold">
        Your baseline is the only reference that was ever about you.
      </p>
      <Button href="/health" size="lg" class="mt-9 h-auto gap-2.5 px-6 py-3.5 text-[15px] hover:scale-102 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
        Start your baseline
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Button>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="border-t border-border/60 relative z-10">
    <div class="mx-auto flex h-[72px] max-w-[1040px] items-center justify-between px-8 font-mono text-[11px] tracking-[0.04em] text-muted-foreground font-semibold">
      <span>MONADA<span class="text-primary">.</span>FOUNDATION</span>
      <span>HELSINKI · TALLINN</span>
    </div>
  </footer>
</div>

<style>
  /* Display face: humane precision against the machine-readout mono. Used only for statements. */
  .serif {
    font-family: "Fraunces", Georgia, "Times New Roman", serif;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  .serif em {
    font-style: italic;
  }

  /* Fluid display scale */
  h1.serif {
    font-size: clamp(40px, 6.2vw, 76px);
  }
  h2.serif {
    font-size: clamp(28px, 3.6vw, 44px);
  }
  section.text-center h2.serif {
    font-size: clamp(30px, 4.4vw, 52px);
  }

  /* tailwind has no 4.5/13/30 spacing steps by default; define the few used above */
  :global(.gap-4\.5) {
    gap: 1.125rem;
  }
  :global(.pt-4\.5) {
    padding-top: 1.125rem;
  }
  :global(.mt-13) {
    margin-top: 3.25rem;
  }
  :global(.pt-30) {
    padding-top: 7.5rem;
  }

  /* The one signature motion: the YOU trace draws in on load. Everything else is static. */
  .trace {
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    animation: draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) 0.1s forwards;
  }
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Fade in animation for points */
  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  /* Solid, premium opacity pulse for SVGs */
  .animate-pulse-ring {
    animation: opacityPulse 2.5s ease-in-out infinite;
  }
  @keyframes opacityPulse {
    0%, 100% {
      opacity: 0.25;
      stroke-width: 1;
    }
    50% {
      opacity: 0.9;
      stroke-width: 2.2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trace {
      stroke-dashoffset: 0;
      animation: none;
    }
    .animate-fade-in {
      opacity: 1;
      animation: none;
    }
    .animate-pulse-ring {
      opacity: 0.6;
      animation: none;
    }
  }
</style>
