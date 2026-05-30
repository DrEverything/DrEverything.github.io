<script lang="ts">
  import { Shield, AlertTriangle, Activity, ArrowRight, Heart, TrendingUp } from "@lucide/svelte/icons";

  // State for the interactive resting heart rate (RHR) simulator
  let baselineRHR = 32; // Athletic normal baseline
  let currentRHR = 64;  // Simulated elevated state (doubled)

  // System interpretation state
  $: isTraditionalApproved = currentRHR >= 60 && currentRHR <= 100;
  $: traditionalStatus = isTraditionalApproved ? "Normal (Approved)" : "Out of Range";
  $: monadaDeviation = ((currentRHR - baselineRHR) / baselineRHR) * 100;
  $: monadaStatus = monadaDeviation >= 50 ? "Critical Systemic Alert" : "Stable";

  // Comparison Data
  const competitors = [
    { name: "Mehiläinen / Terveystalo", price: "€220+", speed: "Days", tracking: "Paper PDF / Flat table" },
    { name: "Traditional Public Health", price: "€0", speed: "Weeks", tracking: "Only tested when sick" },
    { name: "Monada Biometric Engine", price: "€49", speed: "48 Hours", tracking: "Longitudinal Vector Analysis", highlight: true }
  ];
</script>

<div class="w-full max-w-5xl mx-auto px-4 py-8 bg-zinc-950 text-zinc-50 font-sans antialiased">
  
  <!-- Header -->
  <div class="mb-12 border-b border-zinc-900 pb-8">
    <!-- <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 mb-4"> -->
    <!--   <Activity class="w-3.5 h-3.5 text-emerald-500" /> -->
    <!--   <span>Scientific Framework — Phase 0.5</span> -->
    <!-- </div> -->
    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl mb-3">The Baseline Paradox</h1>
    <p class="text-zinc-400 max-w-2xl leading-relaxed">
      Standard diagnostics compare your biology to broad population averages. 
      If you are optimized, your baseline is not average. We track your deviations, not the crowd.
    </p>
  </div>

  <!-- Interactive Proof of Concept: The Heart Rate Anomaly -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
    
    <!-- Controls and Context -->
    <div class="lg:col-span-5 flex flex-col justify-between p-6 rounded-xl border border-zinc-900 bg-zinc-900/40">
      <div>
        <h3 class="text-lg font-semibold mb-2">Simulate a Biometric Shift</h3>
        <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
          Adjust the sliders below to simulate an athletic user whose resting heart rate doubles due to acute overtraining, infection, or cardiac stress.
        </p>

        <!-- Sliders -->
        <div class="space-y-5 mb-8">
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-zinc-400">Your Normal Baseline (RHR)</span>
              <span class="font-mono text-emerald-400">{baselineRHR} BPM</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="55" 
              bind:value={baselineRHR} 
              class="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-zinc-400">Current Measured State</span>
              <span class="font-mono text-amber-400">{currentRHR} BPM</span>
            </div>
            <input 
              type="range" 
              min="55" 
              max="110" 
              bind:value={currentRHR} 
              class="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div class="border-t border-zinc-900 pt-4 text-xs text-zinc-500 leading-relaxed">
        <strong>The Physics of Deviation:</strong> A 100% increase in cardiovascular load is clinically critical, yet falls comfortably inside the standard "60-100 BPM" public reference range.
      </div>
    </div>

    <!-- The System Comparison Display -->
    <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- System A: Standard Population Medicine -->
      <div class="p-6 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Standard Medicine</span>
            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 text-zinc-400 border border-zinc-800">Static Average</span>
          </div>
          <h4 class="text-base font-medium mb-1">Population Reference Range</h4>
          <p class="text-xs text-zinc-400 mb-6">Assumes your body operates identically to a sedentary, heterogeneous demographic.</p>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-xs border-b border-zinc-900 pb-2">
              <span class="text-zinc-500">Allowed Range:</span>
              <span class="font-mono">60 – 100 BPM</span>
            </div>
            <div class="flex justify-between text-xs border-b border-zinc-900 pb-2">
              <span class="text-zinc-500">Your Value:</span>
              <span class="font-mono text-zinc-300">{currentRHR} BPM</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-zinc-900/30 border border-zinc-900 flex items-center gap-3">
          <Shield class="w-5 h-5 text-zinc-500 shrink-0" />
          <div>
            <div class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Diagnosis Output</div>
            <div class="text-xs font-medium text-zinc-300">{traditionalStatus}</div>
          </div>
        </div>
      </div>

      <!-- System B: Monada Vector System -->
      <div class="p-6 rounded-xl border border-emerald-950/40 bg-emerald-950/5 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-semibold tracking-wider text-emerald-500 uppercase">Monada Engine</span>
            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/30 text-emerald-400 border border-emerald-900/40">Vigilant</span>
          </div>
          <h4 class="text-base font-medium mb-1">Longitudinal Vector Analysis</h4>
          <p class="text-xs text-zinc-400 mb-6">Compares your current metrics against your statistically established healthy baseline.</p>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-xs border-b border-emerald-950/20 pb-2">
              <span class="text-emerald-900/60">Your Baseline:</span>
              <span class="font-mono text-emerald-400">{baselineRHR} BPM</span>
            </div>
            <div class="flex justify-between text-xs border-b border-emerald-950/20 pb-2">
              <span class="text-emerald-900/60 font-semibold">Deviation detected:</span>
              <span class="font-mono text-amber-400 font-semibold">+{monadaDeviation.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-amber-950/10 border border-amber-900/30 flex items-center gap-3">
          <AlertTriangle class="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div class="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Diagnosis Output</div>
            <div class="text-xs font-medium text-amber-400">{monadaStatus}</div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Educational Pillars: Blood, Blood Pressure, Heart Rate -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <div class="p-6 rounded-xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition">
      <Heart class="w-5 h-5 text-red-500 mb-4" />
      <h4 class="text-sm font-semibold mb-2">Resting Heart Rate (Daily)</h4>
      <p class="text-xs text-zinc-400 leading-relaxed">
        The ultimate proxy for Autonomic Nervous System load. Spikes in RHR identify acute stress, systemic inflammation, or impending sickness up to 3 days before symptoms manifest.
      </p>
    </div>

    <div class="p-6 rounded-xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition">
      <TrendingUp class="w-5 h-5 text-blue-500 mb-4" />
      <h4 class="text-sm font-semibold mb-2">Blood Pressure (Weekly)</h4>
      <p class="text-xs text-zinc-400 leading-relaxed">
        The silent vascular load metric. While easily measured at home, tracking the statistical baseline prevents structural vascular remodelling and cardiac hypertrophy before damage occurs.
      </p>
    </div>

    <div class="p-6 rounded-xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition">
      <Activity class="w-5 h-5 text-emerald-500 mb-4" />
      <h4 class="text-sm font-semibold mb-2">Blood Biomarkers (Quarterly)</h4>
      <p class="text-xs text-zinc-400 leading-relaxed">
        The molecular engine. Tracking your blood metrics (lipids, ferritin, and hormone ratios) on a quarterly basis builds your unique biological fingerprint, rendering population metrics obsolete [1, 6].
      </p>
    </div>
  </div>

  <!-- Call to Action: Anemia & Iron Launch Panel -->
  <div class="rounded-xl border border-zinc-900 bg-zinc-900/20 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
    <div class="max-w-xl">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 text-[10px] font-mono mb-3">
        Featured Launch Panel
      </div>
      <h3 class="text-xl font-bold mb-2">Anemia & Iron Baseline Profile [1]</h3>
      <p class="text-xs text-zinc-400 leading-relaxed">
        A complete molecular analysis of your iron reserves, cellular health, and oxygen transport capacity [1]. Specifically designed for fatigue assessment, high-output athletes, and vegans [1, 6].
        Includes **PVK (Hemoglobin)**, **Ferritin (Iron Storage)**, and **Active B12** [1, 6].
      </p>
    </div>

    <div class="shrink-0 flex flex-col items-start md:items-end justify-between">
      <div class="mb-4">
        <span class="text-2xl font-mono font-bold">€49.00</span>
        <span class="text-xs text-zinc-500">all-inclusive</span>
      </div>
      <button class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-zinc-50 text-zinc-950 rounded hover:bg-zinc-200 transition focus:outline-none focus:ring-2 focus:ring-zinc-400">
        Secure Early Access
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>

  <!-- Cost Market Warfare Table -->
  <div class="mt-12">
    <div class="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-4">Competitor Landscape — Helsinki Area</div>
    <div class="border border-zinc-900 rounded-lg overflow-hidden text-xs">
      <div class="grid grid-cols-4 bg-zinc-900/40 p-3 border-b border-zinc-900 font-medium text-zinc-400">
        <div>Provider</div>
        <div>Anemia Metrics (PVK + Ferritin + B12)</div>
        <div>Processing Velocity</div>
        <div>Biometric Tracking Method</div>
      </div>
      {#each competitors as competitor}
        <div class="grid grid-cols-4 p-3 border-b border-zinc-900/60 {competitor.highlight ? 'bg-emerald-950/5 text-emerald-400' : 'text-zinc-300'}">
          <div class="font-medium">{competitor.name}</div>
          <div class="font-mono">{competitor.price}</div>
          <div>{competitor.speed}</div>
          <div>{competitor.tracking}</div>
        </div>
      {/each}
    </div>
  </div>

</div>

<style>
  /* Base ranges input reset */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
  }
</style>
