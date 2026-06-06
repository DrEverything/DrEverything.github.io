<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    Fingerprint,
    Activity,
    Scale,
    Zap,
    CalendarDays,
    Heart,
    Shield,
    Check,
    Droplet,
    MapPin,
    ArrowRight,
    Sparkles,
    User
  } from "@lucide/svelte";

  // Tab state for the interactive widget
  let activeTab = $state<"baseline" | "act">("baseline");

  // State for the interactive baseline comparison widget
  let selectedMarker = $state("hr");
  let customValue = $state(60);

  const markers: any = {
    hr: {
      name: "Resting Heart Rate",
      unit: "bpm",
      popMin: 50,
      popMax: 90,
      personalBaseline: 30,
      standardVerdict: "Normal & Healthy (Within 50-90)",
      monadaVerdict: "Critical: 5.2 SD Deviation. Heart rate doubled from baseline.",
      initialVal: 60,
      minLimit: 25,
      maxLimit: 100,
      story: "You are a runner with a baseline of 30 bpm. You feel fatigued and measure 60 bpm. A standard clinic dismisses you because you are inside the population average (50-90 bpm). Monada flags it instantly as a massive systemic shift."
    },
    testo: {
      name: "Total Testosterone",
      unit: "nmol/l",
      popMin: 8.0,
      popMax: 29.0,
      personalBaseline: 24.5,
      standardVerdict: "Normal Range (Within 8.0-29.0)",
      monadaVerdict: "Warning: 3.1 SD Drop. Systemic Recovery Failure.",
      initialVal: 11.2,
      minLimit: 5,
      maxLimit: 35,
      story: "Your baseline is 24.5 nmol/l. You drop to 11.2 nmol/l due to overtraining. Standard labs report 'normal' because it is above 8.0. Monada alerts you to a recovery failure."
    },
    ferritin: {
      name: "Ferritin (Iron Storage)",
      unit: "µg/l",
      popMin: 20,
      popMax: 300,
      personalBaseline: 150,
      standardVerdict: "Normal Range (Within 20-300)",
      monadaVerdict: "Warning: 2.8 SD Drop. Cellular Depletion Underway.",
      initialVal: 45,
      minLimit: 10,
      maxLimit: 350,
      story: "Your baseline is 150 µg/l. Iron depletion drops you to 45 µg/l. Standard labs say you are fine (above 20). Monada flags the downward trajectory."
    }
  };

  // React to marker change to set reasonable starting points on the slider
  $effect(() => {
    if (activeTab === "baseline") {
      customValue = markers[selectedMarker].initialVal;
    }
  });

  // Calculate where the slider value falls relative to the population & personal ranges
  let currentMarkerData = $derived(markers[selectedMarker]);
  let isWithinPopulation = $derived(customValue >= currentMarkerData.popMin && customValue <= currentMarkerData.popMax);
  let deviationFromPersonal = $derived(Math.abs(customValue - currentMarkerData.personalBaseline));

  // State for the interactive ACT Plateau Predictor
  let trainingWeeks = $state(4);
  let currentPerformanceValue = $state(100);
  let decayRate = 0.35; // k (decay rate of gains)
  let initialGain = 8; // D_0 (initial gain)

  // Calculate current performance: P_t = P_0 + sum(D_i)
  let currentPerformance = $derived.by(() => {
    let perf = currentPerformanceValue;
    for (let i = 1; i <= trainingWeeks; i++) {
      perf += initialGain * Math.exp(-decayRate * i);
    }
    return Math.round(perf * 10) / 10;
  });

  // Calculate current gain: D_current
  let currentGain = $derived(Math.round(initialGain * Math.exp(-decayRate * trainingWeeks) * 10) / 10);

  // Plateau: P_plateau = P_current + D_current / (1 - e^-k)
  let projectedPlateau = $derived.by(() => {
    let plateau = currentPerformance + currentGain / (1 - Math.exp(-decayRate));
    return Math.round(plateau * 10) / 10;
  });

  let remainingRunway = $derived(Math.max(0.5, Math.round((projectedPlateau - currentPerformance) * 10) / 10));
  let weeksToPlateau = $derived(Math.max(1, Math.ceil(3 / decayRate) - trainingWeeks));

  // Blood draw method state
  let selectedDraw = $state("clinic");

  const systems = [
    {
      name: "Cardiovascular / Lipid",
      title: "ApoB & Basic Lipids",
      biomarkers: "ApoB, Total Cholesterol, LDL, HDL, Triglycerides",
      desc: "Measures plaque accumulation and cardiovascular disease risk. ApoB dictates the exact concentration of atherogenic particles, tracking risk with absolute precision compared to calculated LDL.",
      icon: Heart
    },
    {
      name: "Metabolic / Insulin",
      title: "Insulin & Glucose Control",
      biomarkers: "HbA1c, Fasting Insulin, Fasting Glucose",
      desc: "Fasting Insulin and HbA1c screening. Catches sub-clinical insulin resistance and metabolic dysfunction up to a decade before fasting glucose alone triggers clinical diabetes alerts.",
      icon: Zap
    },
    {
      name: "Inflammation / Immune",
      title: "hs-CRP & CBC Differential",
      biomarkers: "hs-CRP, PVK (CBC with differential)",
      desc: "High-sensitivity C-reactive protein (hs-CRP) captures low-grade vascular inflammation. Indexed against cellular profiles to track recovery capacity and systemic load.",
      icon: Shield
    },
    {
      name: "Organ Resilience",
      title: "Liver & Kidney Filtration",
      biomarkers: "ALAT (ALT), Creatinine (eGFR)",
      desc: "Tracks hepatic cellular stress (ALAT) and glomerular filtration efficiency. Critical baseline metrics for active athletes consuming high-protein diets.",
      icon: Shield
    },
    {
      name: "Hormonal & Thyroid",
      title: "Testosterone & TSH Baseline",
      biomarkers: "Total Testosterone, TSH",
      desc: "Evaluates endocrine output, metabolic pacing, and systemic recovery velocity. Essential for detecting physical adaptation failure, hypogonadism, or thyroid stress.",
      icon: CalendarDays
    },
    {
      name: "Cellular Micronutrient",
      title: "Ferritin, D, B12 & Magnesium",
      biomarkers: "Ferritin, Vitamin D, Active B12, Magnesium",
      desc: "Measures iron storage (Ferritin), active transport pathways (B12), bone density, and metabolic pacing markers to isolate cellular fatigue.",
      icon: Sparkles
    }
  ];
</script>

<div class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans antialiased relative overflow-hidden bg-radial from-background via-background/95 to-background/80">
  
  <!-- Glowing background blobs -->
  <!-- <div class="absolute -top-[10%] left-[20%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[140px] pointer-events-none"></div> -->
  <!-- <div class="absolute top-[40%] right-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[140px] pointer-events-none"></div> -->
  
  <!-- Navigation Header -->
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <span class="font-mono text-lg font-black tracking-widest text-primary">MONADA</span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <a href="#concept" class="transition-colors hover:text-foreground">Clinical Concept</a>
        <a href="#simulation" class="transition-colors hover:text-foreground">Simulations</a>
        <a href="#radar" class="transition-colors hover:text-foreground">The Panel</a>
        <a href="#pricing" class="transition-colors hover:text-foreground">Pricing & Draw</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="/login" class="inline-flex h-9 items-center justify-center rounded-lg bg-primary hover:bg-primary/95 px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-md active:scale-[0.98]">
          Login
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="mx-auto max-w-4xl px-4 py-16 md:py-24 text-center relative z-10">
    <div class="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/50 backdrop-blur-sm px-3.5 py-1 text-xs text-muted-foreground mb-6 shadow-sm">
      <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
      <span class="font-medium tracking-wide">Direct-to-Consumer Diagnostic Network</span>
    </div>
    
    <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance leading-none">
      Your hospital does not know your <span class="text-primary font-mono bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">baseline</span>.
    </h1>
    
    <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground/90 leading-relaxed">
      Standard clinical pathology compares your biochemistry against sweeping, static population averages. If your biomarkers double or halve but remain inside their wide, arbitrary buckets, you are dismissed as "healthy." 
    </p>

    <p class="mx-auto mt-4 max-w-2xl text-md font-mono text-primary/90 font-medium">
      We bypass the clinical noise. We build your personalized parameter database to track true biological trajectories using Bayesian Z-scores.
    </p>

    <!-- Draw Methods Selection -->
    <div class="mt-12 text-left max-w-3xl mx-auto">
      <h3 class="text-center font-bold text-sm text-muted-foreground uppercase tracking-widest mb-6">Choose Your Blood Draw Logistics</h3>
      <div class="grid gap-4 sm:grid-cols-3">
        <button
          onclick={() => selectedDraw = "clinic"}
          class="flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden bg-card/40 hover:border-primary/50 {selectedDraw === 'clinic' ? 'border-primary/80 ring-2 ring-primary/20 bg-primary/5' : 'border-border/30'}"
        >
          <MapPin class="h-6 w-6 text-primary mb-2" />
          <span class="font-bold text-sm">SYNLAB Clinic Draw</span>
          <span class="text-xs text-muted-foreground/80 mt-1">Fast walk-in at any of 35+ Finnish partner locations. Lowest cost.</span>
          <span class="text-[10px] font-mono mt-3 px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-semibold">Included in Base</span>
        </button>

        <button
          onclick={() => selectedDraw = "self"}
          class="flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden bg-card/40 hover:border-primary/50 {selectedDraw === 'self' ? 'border-primary/80 ring-2 ring-primary/20 bg-primary/5' : 'border-border/30'}"
        >
          <Droplet class="h-6 w-6 text-primary mb-2" />
          <span class="font-bold text-sm">Self-Draw Mail Kit</span>
          <span class="text-xs text-muted-foreground/80 mt-1">Complete lancet sampling at home and mail directly to lab.</span>
          <span class="text-[10px] font-mono mt-3 px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-semibold">+ €15 shipping</span>
        </button>

        <button
          onclick={() => selectedDraw = "nurse"}
          class="flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden bg-card/40 hover:border-primary/50 {selectedDraw === 'nurse' ? 'border-primary/80 ring-2 ring-primary/20 bg-primary/5' : 'border-border/30'}"
        >
          <User class="h-6 w-6 text-primary mb-2" />
          <span class="font-bold text-sm">Nurse Dispatch</span>
          <span class="text-xs text-muted-foreground/80 mt-1">We send a certified nurse to your home or office for the draw.</span>
          <span class="text-[10px] font-mono mt-3 px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-semibold">+ €45 / draw</span>
        </button>
      </div>
    </div>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a href="#pricing" class="inline-flex h-11 items-center justify-center rounded-lg bg-primary hover:bg-primary/95 px-6 py-3 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
        Order Baseline Panel
      </a>
    </div>
  </section>

  <!-- Interactive Section (Simulators) -->
  <section id="simulation" class="border-y border-border/40 bg-muted/20 py-16 relative z-10">
    <div class="mx-auto max-w-4xl px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold tracking-tight">Interactive Platform Simulators</h2>
        <p class="text-sm text-muted-foreground mt-2">Toggle between our biological trajectory baseline engine and our training capacity plateau engine.</p>
        
        <!-- Tab Switcher -->
        <div class="inline-flex p-1 bg-muted/80 rounded-xl border border-border/40 mt-6 shadow-inner">
          <button 
            onclick={() => activeTab = "baseline"}
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 {activeTab === 'baseline' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Biomarker Deviation
          </button>
          <button 
            onclick={() => activeTab = "act"}
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 {activeTab === 'act' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            ACT Plateau Engine
          </button>
        </div>
      </div>

      {#if activeTab === "baseline"}
        <div in:fade={{ duration: 150 }} class="grid gap-6 md:grid-cols-3">
          <!-- Marker Selector -->
          <div class="flex flex-col gap-2.5 bg-card/45 p-4 rounded-2xl border border-border/30 backdrop-blur-sm">
            <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">Select Biomarker</span>
            <button 
              onclick={() => selectedMarker = "hr"} 
              class="flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all border text-left {selectedMarker === 'hr' ? 'bg-primary/10 border-primary/60 text-primary' : 'border-border/30 bg-transparent hover:bg-muted/50'}"
            >
              <span>Resting Heart Rate</span>
              <span class="text-xs font-mono opacity-80">bpm</span>
            </button>
            <button 
              onclick={() => selectedMarker = "testo"} 
              class="flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all border text-left {selectedMarker === 'testo' ? 'bg-primary/10 border-primary/60 text-primary' : 'border-border/30 bg-transparent hover:bg-muted/50'}"
            >
              <span>Total Testosterone</span>
              <span class="text-xs font-mono opacity-80">nmol/l</span>
            </button>
            <button 
              onclick={() => selectedMarker = "ferritin"} 
              class="flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all border text-left {selectedMarker === 'ferritin' ? 'bg-primary/10 border-primary/60 text-primary' : 'border-border/30 bg-transparent hover:bg-muted/50'}"
            >
              <span>Ferritin (Iron)</span>
              <span class="text-xs font-mono opacity-80">µg/l</span>
            </button>
          </div>

          <!-- Simulator Core -->
          <div class="md:col-span-2 flex flex-col justify-between bg-card/45 p-6 rounded-2xl border border-border/30 backdrop-blur-sm">
            <div>
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-extrabold text-lg leading-tight">{currentMarkerData.name}</h3>
                  <p class="text-xs text-muted-foreground mt-1">{currentMarkerData.story}</p>
                </div>
              </div>

              <!-- Custom Value Slider -->
              <div class="space-y-3 mb-6">
                <div class="flex justify-between items-center">
                  <label for="value-slider" class="text-xs text-muted-foreground font-mono">Simulate Blood Lab Result:</label>
                  <span class="font-mono text-xs font-bold bg-primary/15 text-primary px-2.5 py-0.5 rounded-lg border border-primary/10">
                    {customValue} {currentMarkerData.unit}
                  </span>
                </div>
                <input 
                  id="value-slider"
                  type="range" 
                  min={currentMarkerData.minLimit} 
                  max={currentMarkerData.maxLimit} 
                  step={selectedMarker === "testo" ? "0.1" : "1"}
                  bind:value={customValue}
                  class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div class="flex justify-between text-[9px] text-muted-foreground/80 font-mono">
                  <span>Min ({currentMarkerData.minLimit})</span>
                  <span>Personal Baseline: {currentMarkerData.personalBaseline} {currentMarkerData.unit}</span>
                  <span>Max ({currentMarkerData.maxLimit})</span>
                </div>
              </div>
            </div>

            <!-- The Real-time Verdict Comparison -->
            <div class="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-border/40">
              <div class="p-3.5 rounded-xl bg-muted/40 border border-border/20">
                <div class="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider mb-1">Standard Lab Verdict</div>
                <p class="text-sm font-bold {isWithinPopulation ? 'text-emerald-500' : 'text-red-500'}">
                  {isWithinPopulation ? "✅ " + currentMarkerData.standardVerdict : "⚠️ Out of Range"}
                </p>
                <p class="text-[10px] text-muted-foreground mt-1.5 leading-snug">
                  {isWithinPopulation ? "The doctor dismisses you. No anomalies detected because you fall within broad population parameters, even though your value doubled." : "Flagged only because the marker crossed the extreme population limit."}
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-primary/5 border border-primary/15 relative overflow-hidden">
                <div class="absolute -right-2 -bottom-2 opacity-5 text-primary">
                  <Fingerprint class="h-16 w-16" />
                </div>
                <div class="text-[10px] font-bold text-primary font-mono uppercase tracking-wider mb-1">Monada Trajectory Engine</div>
                <p class="text-sm font-bold text-primary leading-tight">
                  {deviationFromPersonal === 0 ? "Perfect Baseline Match" : "🚨 " + currentMarkerData.monadaVerdict}
                </p>
                <p class="text-[10px] text-muted-foreground mt-1.5 leading-snug">
                  Monada calculates a personalized Z-score deviation. This shift represents critical biological stress, bypassing standard ranges.
                </p>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div in:fade={{ duration: 150 }} class="grid gap-6 md:grid-cols-3">
          <!-- ACT Explanation -->
          <div class="flex flex-col bg-card/45 p-5 rounded-2xl border border-border/30 backdrop-blur-sm justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 font-mono mb-2 block">Plateau Math Model</span>
              <h3 class="font-extrabold text-base mb-2">Asymptotic Capacity Trajectory</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Fits your weekly performance data using a non-linear decay algorithm:
              </p>
              <div class="my-3 p-2.5 bg-muted/50 rounded-lg font-mono text-[11px] border border-border/20 text-primary">
                D_t = D_0 &middot; e^(-kt)
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                By modeling the decay rate of weekly gains, the engine projects your upcoming plateau cap and tells you exactly when you will run out of runway.
              </p>
            </div>
            
            <div class="mt-4 pt-3 border-t border-border/25">
              <span class="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest block">Input test-set</span>
              <p class="text-[11px] text-muted-foreground mt-1">A weekly standardized maximal-effort set (e.g. 5-RM lift or 100m row).</p>
            </div>
          </div>

          <!-- ACT Simulator Core -->
          <div class="md:col-span-2 flex flex-col justify-between bg-card/45 p-6 rounded-2xl border border-border/30 backdrop-blur-sm">
            <div class="space-y-5">
              <div class="flex justify-between items-center">
                <h3 class="font-extrabold text-lg">ACT Simulator</h3>
                <span class="text-xs font-mono bg-muted/80 px-2.5 py-1 rounded-lg text-muted-foreground">Exponential Decay Model</span>
              </div>

              <!-- Slider 1: Stimulus Duration -->
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-muted-foreground">Weeks on static training routine:</span>
                  <span class="text-primary font-bold">{trainingWeeks} weeks</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="7"
                  bind:value={trainingWeeks}
                  class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <!-- Slider 2: Baseline Performance -->
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-muted-foreground">Baseline Performance:</span>
                  <span class="text-primary font-bold">{currentPerformanceValue} kg / units</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  bind:value={currentPerformanceValue}
                  class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <!-- Output Verdict -->
            <div class="grid gap-4 sm:grid-cols-2 mt-6 pt-4 border-t border-border/40">
              <div class="p-3.5 rounded-xl bg-muted/40 border border-border/20 flex flex-col justify-between">
                <div>
                  <div class="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-wider mb-1">Current Capacity</div>
                  <p class="text-2xl font-black font-mono text-foreground">{currentPerformance} <span class="text-xs text-muted-foreground">units</span></p>
                </div>
                <p class="text-[10px] text-muted-foreground/80 mt-2 leading-tight">
                  Your current estimated maximum based on stimulus accommodation.
                </p>
              </div>

              <div class="p-3.5 rounded-xl bg-primary/5 border border-primary/15 relative overflow-hidden flex flex-col justify-between">
                <div class="absolute -right-2 -bottom-2 opacity-5 text-primary">
                  <Activity class="h-16 w-16" />
                </div>
                <div>
                  <div class="text-[10px] font-bold text-primary font-mono uppercase tracking-wider mb-1">Plateau Runway Forecast</div>
                  <p class="text-2xl font-black font-mono text-primary">{projectedPlateau} <span class="text-xs text-primary/70">units</span></p>
                </div>
                <p class="text-[11px] text-muted-foreground mt-2 leading-tight font-medium">
                  🚀 <span class="text-primary font-bold">Progress Runway:</span> You will hit a wall in <span class="text-foreground font-bold">{weeksToPlateau} weeks</span>, with {remainingRunway} units of remaining runway.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Platform Modules -->
  <section id="concept" class="mx-auto max-w-6xl px-4 py-16 relative z-10">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-extrabold tracking-tight">The Ultimate Biometric Integration</h2>
      <p class="text-muted-foreground mt-2">Bypassing capital-intensive clinics. A unified SaaS overlay linking biochemistry with daily performance and bioavailable nutrition.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <Fingerprint class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">Bayesian Z-Score Engine</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Constructs your personalized parameters database. Evaluates biomarker fluctuations against your dynamic historical deviations rather than sweeping population brackets.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Bayesian Z-scores</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Baseline DB</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <Activity class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">ACT Capacity Engine</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Estimates your Current Trajectory Cap (CTC) and Remaining Runway. Projects when your workout adaptation rate will plateau using standard weekly test sets.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Plateau Cap</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Progress Runway</span>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <Scale class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">DIAAS Bioavailable Nutrition</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Calculates net functional nitrogen retention. Factors in fluctuating daily macros and true ileal amino acid digestibility data, bypassing simple artificial protein caps.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">DIAAS Score</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Daily Macro Engine</span>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <Zap class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">Wearable API Correlation</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Direct correlation pipelines linking blood work to sleep architecture, HRV, and training loads from Apple Health, Oura, Garmin, and Fitbit.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">HRV / Sleep API</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Correlations</span>
        </div>
      </div>

      <!-- Card 5 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <CalendarDays class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">Cycle & Recovery Diagnostics</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Period prediction algorithms mapped alongside hormonal fluctuations and recovery metrics for female athletes. Simplifies complex endocrine pacing.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Endocrine Pacing</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Cycle Tracking</span>
        </div>
      </div>

      <!-- Card 6 -->
      <div class="flex flex-col justify-between bg-card/40 border border-border/30 backdrop-blur-sm p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
            <Sparkles class="h-5 w-5" />
          </div>
          <h3 class="font-extrabold text-lg mb-2">Goal-Driven Forecasts</h3>
          <p class="text-xs text-muted-foreground/90 leading-relaxed">
            Input target goals (e.g. fat loss, mass gain) and our dynamic energy equations calculate accurate targets factoring in variable dietary habits, not just static models.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/20 flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Interactive Goals</span>
          <span class="text-[10px] font-mono bg-muted/65 px-2 py-0.5 rounded text-muted-foreground font-semibold">Daily Variance</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Biomarkers System Grid -->
  <section id="radar" class="mx-auto max-w-6xl px-4 py-16 relative z-10 border-t border-border/40">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-extrabold tracking-tight">The Universal Health Radar</h2>
      <p class="text-muted-foreground mt-2">To prevent disease before symptoms emerge, you must screen the underlying chemistry. Our flagship panel isolates the 6 core systems of biology.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each systems as system}
        <div class="flex flex-col justify-between bg-card/45 border border-border/35 p-5.5 rounded-2xl hover:border-primary/40 transition-colors shadow-sm">
          <div>
            <div class="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-1.5">{system.name}</div>
            <h3 class="font-extrabold text-base mb-2 text-foreground/90">{system.title}</h3>
            <p class="text-xs text-muted-foreground/90 leading-relaxed">
              {system.desc}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-border/20">
            <span class="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest block mb-1">Assays Included:</span>
            <p class="text-[10px] font-mono text-primary font-bold">{system.biomarkers}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Subscription Pricing -->
  <section id="pricing" class="mx-auto max-w-4xl px-4 py-16 text-center relative z-10 border-t border-border/40">
    <div class="max-w-2xl mx-auto mb-10">
      <h2 class="text-3xl font-extrabold tracking-tight">Simple, Disrupted Subscription Pricing</h2>
      <p class="text-muted-foreground mt-2 text-sm">No clinic markups. Billed every 2 or 3 months depending on draw frequency. Setup covers operations, assay cost, and software.</p>
    </div>

    <div class="mx-auto max-w-sm rounded-2xl border border-border/40 bg-card/50 backdrop-blur-md p-8 text-left shadow-2xl relative overflow-hidden">
      <!-- Glow border overlay -->
      <!-- <div class="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/30 to-indigo-500/20 opacity-30 blur-xs -z-10"></div> -->
      
      <!-- Badge -->
      <div class="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-bl-lg">
        Flagship Panel
      </div>

      <div class="space-y-2">
        <h3 class="font-extrabold text-xl font-mono tracking-wider text-primary">UNIVERSAL HEALTH RADAR</h3>
        <p class="text-xs text-muted-foreground leading-relaxed">Longitudinal biomarker tracking and predictive plateau engines combined in one suite.</p>
      </div>

      <div class="mt-6 flex items-baseline gap-2">
        <span class="text-4xl font-black font-mono text-foreground">€90</span>
        <span class="text-sm font-semibold text-muted-foreground">/ month</span>
      </div>
      <p class="text-[10px] text-muted-foreground mt-1 font-mono">Billed quarterly (€270 per cycle) or bi-annually, including SYNLAB Suomi blood draw fees.</p>

      <ul class="mt-6 space-y-3.5 text-xs text-foreground/90">
        <li class="flex items-center gap-2">
          <Check class="h-4 w-4 text-primary shrink-0 stroke-[3]" />
          <span>Longitudinal Blood Draws (ApoB, TSH, Hormones)</span>
        </li>
        <li class="flex items-center gap-2">
          <Check class="h-4 w-4 text-primary shrink-0 stroke-[3]" />
          <span>Dynamic Bayesian Z-Score Trajectory Database</span>
        </li>
        <li class="flex items-center gap-2">
          <Check class="h-4 w-4 text-primary shrink-0 stroke-[3]" />
          <span>ACT Plateau Engine (Progress Runway Model)</span>
        </li>
        <li class="flex items-center gap-2">
          <Check class="h-4 w-4 text-primary shrink-0 stroke-[3]" />
          <span>DIAAS Bioavailable Nutrition & Goal Forecasts</span>
        </li>
        <li class="flex items-center gap-2">
          <Check class="h-4 w-4 text-primary shrink-0 stroke-[3]" />
          <span>Wearable correlations (Sleep, HRV, Volume APIs)</span>
        </li>
      </ul>

      <div class="mt-8">
        <a href="/login" class="flex h-11 w-full items-center justify-center rounded-lg bg-primary hover:bg-primary/95 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
          Initialize Profile & Choose Draw
        </a>
      </div>
      
      <p class="mt-4 text-center text-[10px] text-muted-foreground leading-snug">
        Cancel anytime. Bypasses clinic fees. Finnish laboratory network integrations with SYNLAB Suomi.
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-border/40 bg-background/50 py-10 relative z-10">
    <div class="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      <div class="flex items-center gap-2 font-mono">
        <span class="font-black text-primary">MONADA</span>
        <span>© 2026</span>
      </div>
      <div class="flex gap-6">
        <a href="#concept" class="hover:text-foreground transition-colors">Concept</a>
        <a href="#simulation" class="hover:text-foreground transition-colors">Simulations</a>
        <a href="/login" class="hover:text-foreground transition-colors">Console Access</a>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Custom slider styling overrides */
  input[type="range"]::-webkit-slider-thumb {
    height: 16px;
    width: 16px;
    border-radius: 9999px;
    background: var(--primary);
    cursor: pointer;
    border: none;
    transition: transform 0.1s ease;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
</style>

