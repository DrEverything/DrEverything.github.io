<script lang="ts">
  // Reactive state using Svelte 5 runes
  let activeTab = $state('labs');
  let comparePanel = $state('anemia');
  let selectedLocation = $state('helsinki');
  let trackingCycleDay = $state(14);

  // Hard statistical data for the comparison module
  const comparisonData = {
    anemia: {
      title: "Anemia & Iron Panel",
      assays: ["PVK (Complete Blood Count)", "Ferritin (Iron Storage)", "Active Vitamin B12"],
      monadaPrice: 49,
      puhtiPrice: 170, // Individual sum equivalent
      mehilaeinenPrice: 230,
      saving: "78%"
    },
    performance: {
      title: "Comprehensive Biometric Panel",
      assays: ["25 Core Biomarkers", "Metabolic Marker Set", "Thyroid Profile", "Hormonal Health Baseline"],
      monadaPrice: 89,
      puhtiPrice: 169,
      mehilaeinenPrice: 380,
      saving: "47%"
    }
  };

  const syncOmaKanta = () => {
    alert("Initiating secure OAuth2 handshake with Kanta (PHR Sandbox)... Instantly building 5-year longitudinal baseline.");
  };
</script>

<div class="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans antialiased">
  <!-- 1. NAVIGATION -->
  <header class="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-8">
        <span class="text-xl font-black tracking-widest text-primary uppercase">Monada</span>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#diagnostics" class="hover:text-primary transition-colors">Diagnostics</a>
          <a href="#unification" class="hover:text-primary transition-colors">OS Architecture</a>
          <a href="#pricing" class="hover:text-primary transition-colors">Pricing Matrix</a>
          <a href="#sovereignty" class="hover:text-primary transition-colors">Sovereignty</a>
        </nav>
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          onclick={syncOmaKanta} 
          class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase border border-border rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-all cursor-pointer"
        >
          <svg class="h-4 w-4 text-emerald-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Sync with OmaKanta
        </button>
        <a href="#pricing" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all">
          Book Panel
        </a>
      </div>
    </div>
  </header>

  <!-- 2. HERO SECTION -->
  <section class="relative py-20 lg:py-32 overflow-hidden border-b border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 flex flex-col gap-6 text-left">
        <div class="inline-flex max-w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <span>Phase 0.5 Launch: National Finland Lab Network Live</span>
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
          The Operating System for Human Biology
        </h1>
        <p class="text-lg text-muted-foreground text-balance">
          Longitudinal biomarker analysis, real-time wearable correlation, and 3D medical imaging. No bloated corporate clinical fees. 100% data sovereign. Managed completely by Svelte-native architecture.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mt-4">
          <a href="#pricing" class="flex items-center justify-center px-6 py-3 font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm tracking-wide uppercase">
            Order Biomarker Panel
          </a>
          <button 
            onclick={syncOmaKanta} 
            class="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg bg-card text-card-foreground border border-border hover:bg-accent transition-all text-sm tracking-wide uppercase cursor-pointer"
          >
            <svg class="h-4 w-4 text-emerald-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Import Historical Kanta Data
          </button>
        </div>
        <div class="flex items-center gap-6 mt-6 text-xs text-muted-foreground border-t border-border pt-6">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            35+ SYNLAB Draw Points in Finland
          </div>
          <div>•</div>
          <div>0% Corporate Tax Retention Structure</div>
          <div>•</div>
          <div>GDPR Private Storage (Tallinn OÜ)</div>
        </div>
      </div>

      <!-- Hero Visual: Mock Dashboard -->
      <div class="lg:col-span-5 bg-card border border-border rounded-xl p-6 shadow-2xl flex flex-col gap-6 relative">
        <div class="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-primary/20 border border-primary animate-ping"></div>
        <div class="flex items-center justify-between border-b border-border pb-4">
          <div class="flex items-center gap-3">
            <span class="h-3 w-3 rounded-full bg-primary"></span>
            <span class="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">Biometric Real-Time Engine</span>
          </div>
          <span class="text-xs font-mono px-2 py-0.5 bg-secondary text-secondary-foreground rounded">ACTIVE CORRELATION</span>
        </div>

        <!-- Metric 1: Kinetic Progression Rate -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-xs font-mono text-muted-foreground">
            <span>STRENGTH DEGRADATION DEVIATION</span>
            <span class="text-primary">1RM MODEL - KINETIC</span>
          </div>
          <div class="h-24 bg-background border border-border rounded flex items-end justify-between p-2 gap-1 overflow-hidden">
            {#each [34, 45, 60, 52, 40, 30, 25, 18, 12, 8] as bar}
              <div class="w-full bg-primary/15 rounded-t hover:bg-primary transition-colors" style="height: {bar}%"></div>
            {/each}
          </div>
          <span class="text-[10px] text-destructive font-mono">WARNING: Progesterone-luteal phase shift correlates to -8.5% recovery rate.</span>
        </div>

        <!-- Metric 2: Raw Lab Assay Delta -->
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-border p-3 rounded bg-background/50">
            <span class="text-[10px] text-muted-foreground block font-mono">S-FERRITIN (BASELINE)</span>
            <span class="text-lg font-bold">14.2 µg/l</span>
            <span class="text-[10px] text-destructive font-mono block">Optimal Target &gt; 50</span>
          </div>
          <div class="border border-border p-3 rounded bg-background/50">
            <span class="text-[10px] text-muted-foreground block font-mono">S-B12-TC2 (ACTIVE)</span>
            <span class="text-lg font-bold">135 pmol/l</span>
            <span class="text-[10px] text-primary font-mono block">Optimal Zone</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. HOW THE PLATFORM WORKS (INTEGRATION DEMONSTRATOR) -->
  <section id="diagnostics" class="py-20 border-b border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-16">
        <h2 class="text-3xl font-extrabold tracking-tight">One Unified Engine, Domain-Segmented Interfaces</h2>
        <p class="text-muted-foreground">We compile physical training logs, deep lab biology, and hardware imaging slices into a single database. Zero data-selling, zero institutional control.</p>
        
        <!-- App switcher simulating user selection -->
        <div class="flex justify-center gap-2 mt-4 bg-card border border-border rounded-lg p-1 max-w-fit mx-auto">
          <button 
            onclick={() => activeTab = 'labs'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {activeTab === 'labs' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Diagnostics
          </button>
          <button 
            onclick={() => activeTab = 'kinetic'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {activeTab === 'kinetic' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Kinetic Engine
          </button>
          <button 
            onclick={() => activeTab = 'dicom'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {activeTab === 'dicom' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            3D DICOM Viewer
          </button>
          <button 
            onclick={() => activeTab = 'cycle'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {activeTab === 'cycle' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Monada Cycle
          </button>
        </div>
      </div>

      <!-- Dynamic Tab content cards -->
      <div class="bg-card border border-border rounded-xl p-8 shadow-sm">
        {#if activeTab === 'labs'}
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="flex flex-col gap-6">
              <h3 class="text-2xl font-bold">Direct-To-Consumer Lab Access (No GP Paywall)</h3>
              <p class="text-muted-foreground">
                In Finland, private hospital networks block diagnostic panels behind an expensive doctor’s appointment [4]. Monada bypasses this gatekeeping. You purchase the panel online, walk into any of our 35+ partner SYNLAB drawing locations, and get drew immediately [4].
              </p>
              <ul class="flex flex-col gap-3 font-mono text-xs text-muted-foreground">
                <li class="flex items-center gap-3">
                  <span class="h-2 w-2 rounded-full bg-primary"></span>
                  Raw XML, HL7, and PDF results ingested and normalized instantly.
                </li>
                <li class="flex items-center gap-3">
                  <span class="h-2 w-2 rounded-full bg-primary"></span>
                  Dynamic tracking: Your data compares against your personal baseline, not broad averages.
                </li>
              </ul>
            </div>
            <div class="border border-border bg-background p-6 rounded-lg flex flex-col gap-4">
              <span class="text-xs font-mono text-primary uppercase block">Lab Process Flow</span>
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-4 border border-border p-3 rounded bg-card">
                  <div class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-mono text-sm font-bold text-secondary-foreground">1</div>
                  <div>
                    <h4 class="text-sm font-bold">Order panel on Monada</h4>
                    <p class="text-xs text-muted-foreground">Your Svelte client instantly generates a digital referral (lähete) [4].</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 border border-border p-3 rounded bg-card">
                  <div class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-mono text-sm font-bold text-secondary-foreground">2</div>
                  <div>
                    <h4 class="text-sm font-bold">Venous Draw at SYNLAB</h4>
                    <p class="text-xs text-muted-foreground">No booking required for standard walk-ins. Premium home-draw available.</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 border border-border p-3 rounded bg-card">
                  <div class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-mono text-sm font-bold text-secondary-foreground">3</div>
                  <div>
                    <h4 class="text-sm font-bold">Ingest & Track</h4>
                    <p class="text-xs text-muted-foreground">Biomarkers parsed and mapped directly into your longitudinal engine.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else if activeTab === 'kinetic'}
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="flex flex-col gap-6">
              <h3 class="text-2xl font-bold">Kinetic Engine: 1RM and Velocity Tracking</h3>
              <p class="text-muted-foreground">
                We track training intensity with a physics-based approach. Monada uses longitudinal velocity progression rate to map your neuro-motor recovery curve instead of relying on standard single-session formulas.
              </p>
              <p class="text-muted-foreground">
                This physical performance matrix overlays your raw chemical blood markers to isolate exactly where overtraining, low iron, or caloric restriction is degrading your power.
              </p>
            </div>
            <div class="border border-border bg-background p-6 rounded-lg flex flex-col gap-4">
              <span class="text-xs font-mono text-primary uppercase block">1RM Longitudinal Estimate</span>
              <div class="flex flex-col gap-2">
                <div class="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>BARBELL SPEED VS. HEMOGLOBIN</span>
                  <span>PREDICTION PROFILE</span>
                </div>
                <div class="p-4 bg-card border border-border rounded flex flex-col gap-2 font-mono text-xs">
                  <div class="flex justify-between">
                    <span>95% Confidence Interval:</span>
                    <span class="text-primary">[ 132.5kg - 138.0kg ]</span>
                  </div>
                  <div class="w-full bg-secondary h-4 rounded-full overflow-hidden">
                    <div class="bg-primary h-full w-4/5"></div>
                  </div>
                  <div class="text-[10px] text-muted-foreground mt-2">
                    Model shows direct systemic decay correlated with a 12% drop in Ferritin levels logged in the Diagnostics Module [2, 3].
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else if activeTab === 'dicom'}
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="flex flex-col gap-6">
              <h3 class="text-2xl font-bold">Zero-Footprint HTML5 3D DICOM Viewer</h3>
              <p class="text-muted-foreground">
                In traditional medical networks, you are handed archaic physical CDs or USB drives of your MRIs or CT scans [2]. You cannot open them without legacy computer hardware.
              </p>
              <p class="text-muted-foreground">
                Monada integrates a web-native 3D HTML5 rendering engine. When you get an MRI through Monada's network, the raw DICOM slices are pushed directly to your personal vault [2]. Render, manipulate, and share high-resolution interactive cross-sections directly on your phone with any specialist worldwide [2].
              </p>
            </div>
            <div class="border border-border bg-background p-4 rounded-lg flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
              <div class="absolute inset-0 bg-radial from-primary/10 to-transparent"></div>
              <svg class="h-24 w-24 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span class="text-xs font-mono tracking-widest text-primary uppercase mt-4 z-10">DICOM Engine Online</span>
              <span class="text-[10px] text-muted-foreground font-mono z-10">HTML5 3D Orthogonal Render Ready</span>
            </div>
          </div>
        {:else if activeTab === 'cycle'}
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="flex flex-col gap-6">
              <h3 class="text-2xl font-bold">Monada Cycle: Scientific Hormone Synchronization</h3>
              <p class="text-muted-foreground">
                Standard menstrual trackers rely on simple calendar predictions [4]. Monada is different. We combine your cycle logs with sleep skin-temperature trends (from Garmin/Oura) and raw blood diagnostics to dynamically predict hormonal shifts.
              </p>
              <p class="text-muted-foreground">
                <strong>Precision Diagnostics:</strong> Standard doctors often draw hormone panels (FSH, LH, Progesterone) on the wrong days, rendering results useless [4]. Monada dynamically calculates your exact peak cycle days and reminds you to get drawn, guaranteeing precise data [4].
              </p>
            </div>
            <div class="border border-border bg-background p-6 rounded-lg flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="text-xs font-mono text-primary uppercase block">Dynamic Hormone Calibration</span>
                <span class="text-xs font-mono px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded">Cycle Day {trackingCycleDay}</span>
              </div>
              <div class="space-y-4 font-mono text-xs">
                <div class="flex justify-between items-center border-b border-border pb-2">
                  <span>FSH/LH Draw Window:</span>
                  <span class="text-muted-foreground">Ended (Day 3-5 optimal)</span>
                </div>
                <div class="flex justify-between items-center border-b border-border pb-2">
                  <span>Progesterone Peak Window:</span>
                  <span class="text-emerald-500 font-bold">Active (Target Day 21)</span>
                </div>
                <div class="p-3 bg-secondary rounded text-[11px] text-secondary-foreground leading-relaxed">
                  Your Garmin core body temperature shows a +0.41°C deviation logged yesterday, validating post-ovulatory luteal phase shift. Schedule your Progesterone assay now.
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- 4. COMPARISON MATRIX (THE WEAPON) -->
  <section id="pricing" class="py-20 border-b border-border bg-muted/40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-16">
        <h2 class="text-3xl font-extrabold tracking-tight">Decimating Corporate Pricing Structures</h2>
        <p class="text-muted-foreground">Because we do not run physical hospital networks with heavy administrator salaries, we offer the raw price of chemical analysis with clean, digital margins [5].</p>
        
        <!-- Tab selector for comparison products -->
        <div class="flex justify-center gap-2 mt-4 bg-card border border-border rounded-lg p-1 max-w-fit mx-auto">
          <button 
            onclick={() => comparePanel = 'anemia'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {comparePanel === 'anemia' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Anemia & Iron Panel
          </button>
          <button 
            onclick={() => comparePanel = 'performance'} 
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer {comparePanel === 'performance' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            Comprehensive Performance
          </button>
        </div>
      </div>

      <!-- Live Pricing Calculator / Contrast Panel -->
      <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        
        <!-- The Product Card -->
        <div class="lg:col-span-5 bg-card border border-border rounded-xl p-8 flex flex-col justify-between shadow-sm">
          <div class="flex flex-col gap-6">
            <span class="text-xs font-mono text-primary uppercase block tracking-widest">Active Monada Panel</span>
            <h3 class="text-2xl font-black">{comparisonData[comparePanel].title}</h3>
            
            <div class="border-t border-b border-border py-4">
              <span class="text-[10px] text-muted-foreground block font-mono mb-2 uppercase">Included Assays & Markers:</span>
              <ul class="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
                {#each comparisonData[comparePanel].assays as assay}
                  <li class="flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {assay}
                  </li>
                {/each}
              </ul>
            </div>
          </div>

          <div class="mt-8">
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-4xl font-black tracking-tight">€{comparisonData[comparePanel].monadaPrice}.00</span>
              <span class="text-xs text-muted-foreground uppercase font-mono">All-inclusive draw fee</span>
            </div>
            <a href="#booking" class="w-full inline-flex items-center justify-center py-3 text-xs font-bold tracking-widest uppercase rounded bg-primary text-primary-foreground hover:opacity-95 transition-all">
              Book Referral Now
            </a>
          </div>
        </div>

        <!-- The Corporate Comparison -->
        <div class="lg:col-span-7 bg-card border border-border rounded-xl p-8 flex flex-col justify-between shadow-sm">
          <div class="flex flex-col gap-6">
            <div class="flex justify-between items-center">
              <span class="text-xs font-mono text-destructive uppercase block tracking-widest">Market Comparison Matrix</span>
              <span class="text-xs font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">Monada saves you {comparisonData[comparePanel].saving}</span>
            </div>

            <!-- Price comparison lines -->
            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h4 class="text-sm font-bold">Mehiläinen (Individual Clinic Request)</h4>
                  <p class="text-xs text-muted-foreground">Excludes initial GP referral fee of €120 [4].</p>
                </div>
                <span class="text-lg font-mono font-bold text-destructive">€{comparisonData[comparePanel].mehilaeinenPrice}.00</span>
              </div>

              <div class="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h4 class="text-sm font-bold">Puhti (Retail Storefront)</h4>
                  <p class="text-xs text-muted-foreground">Owned by Mehiläinen. Restricts raw imaging and data integration [5].</p>
                </div>
                <span class="text-lg font-mono font-bold text-destructive/80">€{comparisonData[comparePanel].puhtiPrice}.00</span>
              </div>

              <div class="flex justify-between items-center pb-3">
                <div>
                  <h4 class="text-sm font-bold text-primary">Monada Core Network</h4>
                  <p class="text-xs text-muted-foreground">Direct-to-consumer B2B pricing model at SYNLAB clinics [4, 5].</p>
                </div>
                <span class="text-lg font-mono font-bold text-primary">€{comparisonData[comparePanel].monadaPrice}.00</span>
              </div>
            </div>
          </div>

          <!-- Micro comparison note -->
          <p class="text-[11px] font-mono text-muted-foreground leading-relaxed mt-8 border-t border-border pt-4">
            Under EU Directive 2011/24/EU, if you are a Finnish citizen seeking diagnostics across cross-border hubs (like our primary Tallinn infrastructure), you may claim Kela reimbursement, dropping Monada's net cost significantly [6].
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- 5. SECURITY & SOVEREIGNTY -->
  <section id="sovereignty" class="py-20 border-b border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
      <div class="flex flex-col gap-6">
        <span class="text-xs font-mono text-primary uppercase block tracking-widest">Sovereignty Protocol</span>
        <h2 class="text-3xl font-extrabold tracking-tight">Your Biology is Your Own.</h2>
        <p class="text-muted-foreground">
          Traditional healthcare applications operate on a surveillance business model. They sell aggregate biometric statistics to health insurance providers and medical advertising agencies to increase their valuations [5].
        </p>
        <p class="text-muted-foreground">
          <strong>The Monada Promise:</strong> Your data sits under strict GDPR jurisdiction managed through our Tallinn OÜ operating entity [4, 9]. We do not run ads, we do not package datasets, and we do not sell insights [4]. If you close your account, your entire biological record, PACS raw images, and biometric baseline models are completely wiped from our S3 and PostgreSQL nodes within 60 seconds [4, 9].
        </p>
      </div>
      <div class="bg-card border border-border rounded-xl p-8 flex flex-col gap-6 font-mono text-xs">
        <span class="text-xs font-mono text-primary uppercase block">System Architecture Integrity</span>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-border pb-2">
            <span>Corporate Jurisdiction:</span>
            <span class="text-primary">Estonian OÜ (0% Retained Income Tax)</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span>Physical Lab Logistics:</span>
            <span class="text-primary">UN3373 Temperature-Controlled Chain</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span>Server Framework:</span>
            <span class="text-primary">Svelte 5 / Node Serverless</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span>Encryption Standard:</span>
            <span class="text-primary">AES-GCM Authenticated Storage</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. FOOTER -->
  <footer class="py-12 bg-card border-t border-border text-xs text-muted-foreground">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6 items-center">
      <div class="flex flex-col gap-2 text-center md:text-left">
        <span class="text-lg font-black tracking-widest text-primary uppercase">Monada</span>
        <span>© 2026 Monada. All rights reserved. Built for biometric agency.</span>
      </div>
      <div class="flex gap-6 font-mono">
        <a href="#diagnostics" class="hover:text-primary">Diagnostics</a>
        <a href="#unification" class="hover:text-primary">OS Core</a>
        <a href="#pricing" class="hover:text-primary">Pricing</a>
        <a href="#sovereignty" class="hover:text-primary">Privacy</a>
      </div>
    </div>
  </footer>
</div>
