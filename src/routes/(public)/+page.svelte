<script lang="ts">
  // State for the interactive baseline comparison widget
  let selectedMarker = $state("hr");
  let customValue = $state(60);

  const markers: any = {
    hr: {
      name: "Resting Heart Rate",
      unit: "bpm",
      popMin: 50,
      popMax: 90,
      personalBaseline: 36,
      standardVerdict: "Normal Range (Within 50-90)",
      monadaVerdict: "Critical: 4.8 SD Deviation from Personal Baseline",
      initialVal: 60,
      minLimit: 30,
      maxLimit: 100
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
      maxLimit: 35
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
      maxLimit: 350
    }
  };

  // React to marker change to set reasonable starting points on the slider
  $effect(() => {
    customValue = markers[selectedMarker].initialVal;
  });

  // Calculate where the slider value falls relative to the population & personal ranges
  let currentMarkerData = $derived(markers[selectedMarker]);
  let isWithinPopulation = $derived(customValue >= currentMarkerData.popMin && customValue <= currentMarkerData.popMax);
  let deviationFromPersonal = $derived(Math.abs(customValue - currentMarkerData.personalBaseline));
</script>

<div class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans antialiased">
  <!-- Navigation Header -->
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <span class="font-mono text-lg font-black tracking-widest text-primary">MONADA</span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <a href="#problem" class="transition-colors hover:text-foreground">The Arbitrage</a>
        <a href="#interactive" class="transition-colors hover:text-foreground">Simulation</a>
        <a href="#panel" class="transition-colors hover:text-foreground">The Panel</a>
        <a href="#logistics" class="transition-colors hover:text-foreground">Logistics</a>
        <a href="#pricing" class="transition-colors hover:text-foreground">Pricing</a>
      </nav>
      <div class="flex items-center gap-3">
        <!-- <a href="/login" class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"> -->
        <!--   Log In -->
        <!-- </a> -->
        <a href="/login" class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Login
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="mx-auto max-w-4xl px-4 py-16 md:py-24 text-center">
    <div class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
      <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>Direct-to-Consumer Diagnostic Network</span>
    </div>
    
    <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
      Your hospital does not know your <span class="text-primary font-mono font-bold">baseline</span>.
    </h1>
    
    <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
      Standard clinical pathology compares your unique biochemistry against sweeping, static population averages. If your biomarkers double or halve but remain inside their wide, arbitrary buckets, you are dismissed as "healthy." 
    </p>

    <p class="mx-auto mt-4 max-w-2xl text-md font-mono text-primary/80">
      We bypass the clinical noise. We track your true biological trajectories using personalized Bayesian Z-scores.
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a href="#pricing" class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Order Initial Panel
      </a>
    </div>
  </section>

  <!-- Interactive Section (The Problem Proof) -->
  <section id="interactive" class="border-y border-border bg-muted/30 py-16">
    <div class="mx-auto max-w-4xl px-4">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold tracking-tight">The Diagnostic Illusion</h2>
        <p class="text-sm text-muted-foreground mt-2">See how easily conventional healthcare misses major systemic shifts in your body.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Marker Selector -->
        <div class="flex flex-col gap-2 bg-card p-4 rounded-lg border border-border">
          <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Select Biomarker</span>
          <button 
            onclick={() => selectedMarker = "hr"} 
            class="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors border text-left {selectedMarker === 'hr' ? 'bg-primary/10 border-primary text-primary' : 'border-border bg-transparent hover:bg-muted'}"
          >
            <span>Resting Heart Rate</span>
            <span class="text-xs font-mono">bpm</span>
          </button>
          <button 
            onclick={() => selectedMarker = "testo"} 
            class="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors border text-left {selectedMarker === 'testo' ? 'bg-primary/10 border-primary text-primary' : 'border-border bg-transparent hover:bg-muted'}"
          >
            <span>Total Testosterone</span>
            <span class="text-xs font-mono">nmol/l</span>
          </button>
          <button 
            onclick={() => selectedMarker = "ferritin"} 
            class="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors border text-left {selectedMarker === 'ferritin' ? 'bg-primary/10 border-primary text-primary' : 'border-border bg-transparent hover:bg-muted'}"
          >
            <span>Ferritin (Iron)</span>
            <span class="text-xs font-mono">µg/l</span>
          </button>
        </div>

        <!-- Simulator Core -->
        <div class="md:col-span-2 flex flex-col justify-between bg-card p-6 rounded-lg border border-border">
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">{currentMarkerData.name}</h3>
              <span class="font-mono text-sm bg-muted px-2 py-0.5 rounded text-muted-foreground">
                Current Value: {customValue} {currentMarkerData.unit}
              </span>
            </div>

            <!-- Custom Value Slider -->
            <div class="space-y-2 mb-6">
              <label for="value-slider" class="text-xs text-muted-foreground font-mono">Simulate Measured Blood Result:</label>
              <input 
                id="value-slider"
                type="range" 
                min={currentMarkerData.minLimit} 
                max={currentMarkerData.maxLimit} 
                step={selectedMarker === "testo" ? "0.1" : "1"}
                bind:value={customValue}
                class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div class="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Min ({currentMarkerData.minLimit})</span>
                <span>Your Baseline: {currentMarkerData.personalBaseline} {currentMarkerData.unit}</span>
                <span>Max ({currentMarkerData.maxLimit})</span>
              </div>
            </div>
          </div>

          <!-- The Real-time Verdict Comparison -->
          <div class="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-border">
            <div class="p-3 rounded bg-zinc-100 dark:bg-zinc-900 border border-border">
              <div class="text-xs font-bold text-amber-600 dark:text-amber-500 font-mono uppercase tracking-wider mb-1">Standard Lab Verdict</div>
              <p class="text-sm font-semibold {isWithinPopulation ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}">
                {isWithinPopulation ? "✅ " + currentMarkerData.standardVerdict : "⚠️ Out of Range"}
              </p>
              <p class="text-[11px] text-muted-foreground mt-1 leading-snug">
                {isWithinPopulation ? "The doctor dismisses you. No anomalies detected because you fall within broad population parameters." : "Flagged only because the marker crossed the extreme population threshold."}
              </p>
            </div>

            <div class="p-3 rounded bg-primary/5 border border-primary/25">
              <div class="text-xs font-bold text-primary font-mono uppercase tracking-wider mb-1">Monada Trajectory Engine</div>
              <p class="text-sm font-semibold text-primary">
                {deviationFromPersonal === 0 ? "Perfect Baseline" : "🚨 " + currentMarkerData.monadaVerdict}
              </p>
              <p class="text-[11px] text-muted-foreground mt-1 leading-snug">
                Monada isolates your mathematical variance. A deviation this fast indicates structural stress, regardless of general population scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Biomarkers System Grid -->
  <section id="panel" class="mx-auto max-w-6xl px-4 py-16">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-bold tracking-tight">The Universal Health Radar</h2>
      <p class="text-muted-foreground mt-2">To prevent acute disease, you must screen the underlying chemistry. Our Phase 0 default panel isolates the 6 core systems of functional biology.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">01. Cardiovascular / Lipids</div>
          <h3 class="font-bold text-lg mb-2">ApoB & Basic Lipids</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Measures Apolipoprotein B alongside standard LDL/HDL. ApoB dictates the exact concentration of atherogenic particles, tracking cardiovascular risk with absolute precision compared to calculated LDL.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">ApoB</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Total Chol</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Triglycerides</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">02. Metabolic Function</div>
          <h3 class="font-bold text-lg mb-2">Insulin & Glucose Control</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Fasting Insulin and HbA1c screening. Catches sub-clinical insulin resistance and metabolic dysfunction up to a decade before fasting glucose alone triggers clinical diabetes alerts.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">HbA1c</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Fasting Insulin</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Glucose</span>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">03. Inflammation & Immune</div>
          <h3 class="font-bold text-lg mb-2">hs-CRP & Complete Blood Count</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            High-sensitivity C-reactive protein (hs-CRP) captures systemic low-grade vascular inflammation. Coupled with a full cellular profile (PVK) to index chronic stress, recovery capacity, or overtraining.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">hs-CRP</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">PVK (CBC)</span>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">04. Organ Resilience</div>
          <h3 class="font-bold text-lg mb-2">Liver & Kidney Filtration</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Tracks ALAT (ALT) and Creatinine (eGFR) to screen hepatic cellular stress (fatty liver indices) and glomerular filtration efficiency. Essential baseline metrics for active athletes consuming high-protein loads.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">ALAT</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Creatinine</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">eGFR</span>
        </div>
      </div>

      <!-- Card 5 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">05. Hormonal & Thyroid</div>
          <h3 class="font-bold text-lg mb-2">Testosterone & TSH Baseline</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Total Testosterone and Thyroid-Stimulating Hormone (TSH). Evaluates endocrine output, metabolic pacing, and systemic recovery velocity. Essential for detecting physical adaptation failure and thyroid stress.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Total Testo</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">TSH</span>
        </div>
      </div>

      <!-- Card 6 -->
      <div class="flex flex-col justify-between bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
        <div>
          <div class="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-1">06. Cellular Micronutrient</div>
          <h3 class="font-bold text-lg mb-2">Ferritin, D, B12 & Magnesium</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Identifies cellular energy blockades. Measures iron storage (Ferritin), active transport pathways (Active B12), skeletal and metabolic pacing markers (Vitamin D, Serum Magnesium).
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Ferritin</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Vitamin D</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">B12</span>
          <span class="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">Magnesium</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Logistics Section -->
  <section id="logistics" class="border-t border-border bg-muted/25 py-16">
    <div class="mx-auto max-w-4xl px-4">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-2xl font-bold tracking-tight">Standardized Cross-Border Logistics</h2>
        <p class="text-sm text-muted-foreground mt-2">Zero clinical bureaucracy. We leverage existing high-density infrastructures for immediate, professional sampling.</p>
      </div>

      <div class="grid gap-8 sm:grid-cols-3">
        <div class="space-y-2">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-sm">1</div>
          <h4 class="font-bold text-base">Digital Referral Generation</h4>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Order your panel instantly via Monada OS. Our automated referral partner pipeline immediately routes the electronic laboratory referral (läheteyhteistyö) straight into the Finnish partner network.
          </p>
        </div>

        <div class="space-y-2">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-sm">2</div>
          <h4 class="font-bold text-base">5-Min Draw at Partner Locations</h4>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Walk into any of the 35+ professional SYNLAB Suomi blood draw centers across Finland. A certified laboratory nurse draws your panel in minutes. No clinic fees, no doctor's appointments.
          </p>
        </div>

        <div class="space-y-2">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-sm">3</div>
          <h4 class="font-bold text-base">Real-time Bayesian Baseline Analysis</h4>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Raw results route directly from the laboratory into your Monada database. We clean the values, calculate your personalized Z-score offsets, and update your trajectory modeling vectors instantly.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="mx-auto max-w-4xl px-4 py-16 text-center">
    <div class="max-w-2xl mx-auto mb-10">
      <h2 class="text-3xl font-extrabold tracking-tight">Predictable, Cost-Disrupted Tracking</h2>
      <p class="text-muted-foreground mt-2 text-sm">No clinical markups. We charge a flat membership fee that covers operations, pipeline software, and the raw chemical assays at cost.</p>
    </div>

    <div class="mx-auto max-w-sm rounded-xl border border-border bg-card p-8 text-left shadow-sm relative overflow-hidden">
      <!-- Badge -->
      <div class="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-bl-lg font-bold">
        Phase 0 Flagship
      </div>

      <div class="space-y-2">
        <h3 class="font-bold text-xl font-mono tracking-wide text-primary">UNIVERSAL HEALTH RADAR</h3>
        <p class="text-xs text-muted-foreground">Comprehensive longitudinal wellness monitoring with no administrative overhead.</p>
      </div>

      <div class="mt-6 flex items-baseline gap-2">
        <span class="text-4xl font-extrabold tracking-tight font-mono">€90</span>
        <span class="text-sm font-medium text-muted-foreground">/ month</span>
      </div>
      <p class="text-[10px] text-muted-foreground mt-1 font-mono">Billed quarterly (€270 per cycle, including professional blood draw fees)</p>

      <ul class="mt-6 space-y-3 text-xs">
        <li class="flex items-center gap-2">
          <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>4 Complete 17-Assay Blood Draws Per Year</span>
        </li>
        <li class="flex items-center gap-2">
          <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Dynamic Bayesian Z-Score Baseline Calculations</span>
        </li>
        <li class="flex items-center gap-2">
          <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Asymptotic Performance Forecasting (ACT Engine)</span>
        </li>
        <li class="flex items-center gap-2">
          <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>DIAAS Bioavailability Protein & Macro Tracking</span>
        </li>
        <li class="flex items-center gap-2">
          <svg class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Wearable API Correlation (Garmin, Oura, Apple Health)</span>
        </li>
      </ul>

      <div class="mt-8">
        <a href="/login?checkout=universal" class="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Initialize Profile & Schedule Draw
        </a>
      </div>
      
      <p class="mt-3 text-center text-[10px] text-muted-foreground leading-snug">
        No long-term commitments. Cancel anytime. All samples compiled in standard sterile clinical chains.
      </p>
    </div>
  </section>

  <!-- Footer -->
  <!-- <footer class="border-t border-border bg-background py-10"> -->
  <!--   <div class="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"> -->
  <!--     <div class="flex items-center gap-2 font-mono"> -->
  <!--       <span class="font-black text-primary">MONADA</span> -->
  <!--       <span>© 2026</span> -->
  <!--     </div> -->
  <!--     <div class="flex gap-6"> -->
  <!--       <a href="#problem" class="hover:text-foreground">Clinical Arbitrage</a> -->
  <!--       <a href="https://monada.foundation" class="hover:text-foreground">monada.foundation</a> -->
  <!--       <a href="/login" class="hover:text-foreground">Console Access</a> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </footer> -->
</div>

<style>
  /* Custom slider styling fallback */
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
