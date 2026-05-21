<script lang="ts">
  // State for tracking the active interactive module demo
  let activeModuleId = $state("kinetic");

  // Modules array combining your stage plans
  const modules = [
    {
      id: "kinetic",
      name: "Monada Kinetic",
      category: "Performance & Bio-Telemetry",
      description:
        "Physics-based performance modeling, 1RM longitudinal progression vectors, and precise PDCAAS bio-availability tracking. Built to bypass typical app store latency and optimize individual kinetic output.",
      status: "Active Development",
      badge: "Phase 0",
      features: [
        "Longitudinal 1RM confidence interval modeling",
        "PDCAAS amino acid profile mapping",
        "PWA architecture for raw execution access",
      ],
    },
    {
      id: "clinical",
      name: "Monada Diagnostics",
      category: "Decentralized Healthcare",
      description:
        "Direct-to-consumer diagnostics designed to process patient blood draws and high-resolution imaging pathways. Direct logistics pipelines to eliminate institutional friction.",
      status: "In Pipeline",
      badge: "Phase 1",
      features: [
        "Home-draw nurse dispatch system",
        "Automated cross-border regulatory classification",
        "Dual-blind adversarial radiologist audit engine",
      ],
    },
    {
      id: "operating",
      name: "Monada Operating Suite",
      category: "Enterprise Infrastructure",
      description:
        "A zero-bureaucracy platform engineered to build, run, and scale operations. Continuous automation of compliance, localized legal structures, and capital routing.",
      status: "Research & Planning",
      badge: "Phase 2",
      features: [
        "Instant entity deployment via clean legal abstractions",
        "Algorithmic tax and ledger reconciliation",
        "Blind Dutch auctions for project-to-agent dispatch",
      ],
    },
    {
      id: "collaborative",
      name: "Monada Synergy",
      category: "Agency & Task Coordination",
      description:
        "An integrated command interface designed to plan objectives, map asymmetric project dependencies, and execute multi-agent workflows without meeting overhead.",
      status: "Planning",
      badge: "Phase 2",
      features: [
        "Thermodynamic difficulty task weights",
        "Directed acyclic graph (DAG) project mapping",
        "Verification-based consensus protocols",
      ],
    },
  ];

  // Core metrics demonstrating the operational thesis
  const efficiencyMetrics = [
    {
      metric: "Operational Latency",
      legacy: "180 Days",
      monada: "< 48 Hours",
      status: "Targeted",
    },
    {
      metric: "Administrative Overhead",
      legacy: "40% - 60%",
      monada: "< 5%",
      status: "System Level",
    },
    {
      metric: "Verification Strategy",
      legacy: "Manual / Biased",
      monada: "Adversarial / Cryptographic",
      status: "Core",
    },
  ];

  function setActiveModule(id: string) {
    activeModuleId = id;
  }
</script>

<div
  class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans antialiased"
>
  <!-- Header / Navigation -->
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
  >
    <div
      class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-2">
        <!-- Monada Monolithic Emblem -->
        <!-- <svg class="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> -->
        <!--   <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /> -->
        <!--   <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8M8 12h8" /> -->
        <!-- </svg> -->

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3.0"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-omega text-primary"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 19h5v-1a7.35 7.35 0 1 1 6 0v1h5" />
        </svg>
        <span class="text-lg font-bold tracking-tight uppercase">Monada</span>
      </div>

      <nav
        class="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground"
      >
        <a href="#thesis" class="hover:text-foreground transition-colors"
          >Our Thesis</a
        >
        <a href="#modules" class="hover:text-foreground transition-colors"
          >Modules</a
        >
        <a href="#architecture" class="hover:text-foreground transition-colors"
          >Architecture</a
        >
      </nav>

      <div class="flex items-center gap-4">
        <a
          href="/login"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Sign In
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section
    class="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 border-b border-border"
  >
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center"
      >
        <div class="lg:col-span-7 space-y-6">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-mono text-muted-foreground"
          >
            <span class="flex h-2 w-2 rounded-full bg-primary animate-pulse"
            ></span>
            System Phase 0 · Live Execution
          </div>

          <h1
            class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            The world is highly inefficient. <br>That <span class="text-primary"
              >needs to change</span
            >.
          </h1>

          <p class="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Monada is a high-performance infrastructure layer designed to
            optimize human agency. We build clean, modular tools spanning health
            diagnostics, kinetic progression, and organizational
            logistics—engineered from first principles to eliminate
            institutional stagnation.
          </p>
        </div>

        <!-- Hero Graphic (Simulated Diagnostic Pipeline) -->
        <div class="lg:col-span-5">
          <div
            class="rounded-xl border border-border bg-card p-6 shadow-xl font-mono text-xs text-muted-foreground relative"
          >
            <div class="absolute top-3 right-3 flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-chart-1"></span>
              <span class="h-2 w-2 rounded-full bg-chart-2"></span>
              <span class="h-2 w-2 rounded-full bg-chart-3"></span>
            </div>

            <div
              class="border-b border-border pb-3 mb-4 flex items-center justify-between"
            >
              <span class="text-foreground font-semibold"
                >monada_kernel_init.sh</span
              >
              <span class="text-chart-2">ONLINE</span>
            </div>

            <div class="space-y-2 select-none">
              <p>
                <span class="text-primary">❯</span> loading core structures...
                <span class="text-foreground">OK</span>
              </p>
              <p>
                <span class="text-primary">❯</span> seeding module: kinetic...
                <span class="text-foreground">0.141-alpha</span>
              </p>
              <p>
                <span class="text-primary">❯</span> testing diagnostics
                dispatch... <span class="text-chart-4">Awaiting Signal</span>
              </p>

              <!-- Simulated progress bars and metrics -->
              <div class="pt-4 border-t border-border mt-4 space-y-3">
                <div>
                  <div class="flex justify-between mb-1 text-[10px]">
                    <span>SYSTEM LATENCY PROFILE</span>
                    <span class="text-foreground font-bold">OPTIMAL</span>
                  </div>
                  <div class="h-2 bg-muted rounded-full overflow-hidden">
                    <div class="h-full bg-primary" style="width: 94%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1 text-[10px]">
                    <span>AGENCY CONVERSION RATIO</span>
                    <span class="text-chart-2 font-bold">MAXIMUM</span>
                  </div>
                  <div class="h-2 bg-muted rounded-full overflow-hidden">
                    <div class="h-full bg-chart-2" style="width: 88%"></div>
                  </div>
                </div>
              </div>

              <div
                class="bg-muted p-2 rounded-md border border-border mt-4 text-[11px] text-foreground flex items-center justify-between"
              >
                <span>Direct SEPA Infrastructure active.</span>
                <span class="text-primary">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Efficiency Thesis Section -->
  <section
    id="thesis"
    class="py-16 lg:py-24 border-b border-border bg-muted/20"
  >
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <h2
          class="text-xs font-bold tracking-widest text-primary uppercase mb-2"
        >
          Operational Philosophy
        </h2>
        <p
          class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Maximizing output by removing middle layers.
        </p>
        <p class="mt-4 text-muted-foreground leading-relaxed">
          The current landscape is paralyzed by bureaucracy, artificial
          gatekeeping, and legacy technical debt. Monada's sole mandate is to
          bypass these bottlenecks through unified, performant infrastructure.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {#each efficiencyMetrics as item}
          <div
            class="rounded-xl border border-border bg-card p-6 flex flex-col justify-between"
          >
            <div class="space-y-2">
              <div class="text-xs font-mono font-bold text-primary">
                {item.status}
              </div>
              <h3 class="text-lg font-bold text-foreground">{item.metric}</h3>
            </div>
            <div
              class="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-xs font-mono"
            >
              <div>
                <span class="text-muted-foreground block">Legacy Path</span>
                <span class="text-destructive font-semibold line-through"
                  >{item.legacy}</span
                >
              </div>
              <div>
                <span class="text-muted-foreground block">Monada</span>
                <span class="text-chart-2 font-bold">{item.monada}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- App / Modules Segment -->
  <section id="modules" class="py-16 lg:py-24 border-b border-border">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
      >
        <div>
          <h2
            class="text-xs font-bold tracking-widest text-primary uppercase mb-2"
          >
            The Pipeline
          </h2>
          <p
            class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Modular Execution Packages
          </p>
        </div>
        <div class="text-sm text-muted-foreground max-w-md">
          A programmatic suite of tools built on a shared data layer. Auth once,
          scale endlessly. No context switching.
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sidebar Navigation Lists -->
        <div class="lg:col-span-4 space-y-3">
          {#each modules as mod}
            <button
              onclick={() => setActiveModule(mod.id)}
              class="w-full text-left p-4 rounded-xl border transition-all duration-200 block relative focus:outline-none focus:ring-1 focus:ring-primary {activeModuleId ===
              mod.id
                ? 'bg-card border-primary/40 shadow-md'
                : 'border-border bg-background hover:bg-muted/50'}"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-mono font-semibold text-primary"
                  >{mod.badge}</span
                >
                <span
                  class="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                  >{mod.status}</span
                >
              </div>
              <h3 class="font-bold text-foreground text-base">{mod.name}</h3>
              <p class="text-xs text-muted-foreground line-clamp-1 mt-1">
                {mod.category}
              </p>
            </button>
          {/each}
        </div>

        <!-- Wireframe Simulator and Content Panel -->
        <div
          class="lg:col-span-8 rounded-2xl border border-border bg-card overflow-hidden shadow-lg min-h-[460px] flex flex-col justify-between"
        >
          {#each modules as mod}
            {#if activeModuleId === mod.id}
              <!-- Header Details -->
              <div class="p-6 md:p-8 border-b border-border">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-mono text-muted-foreground"
                    >{mod.category}</span
                  >
                  <span class="text-xs text-muted-foreground">•</span>
                  <span class="text-xs font-mono text-primary font-bold"
                    >{mod.status}</span
                  >
                </div>
                <h3 class="text-2xl font-bold text-foreground mb-4">
                  {mod.name}
                </h3>
                <p
                  class="text-muted-foreground leading-relaxed text-sm md:text-base"
                >
                  {mod.description}
                </p>
              </div>

              <!-- Interactive/Visual Programmatic Mockup (Simulated Screenshots) -->
              <div
                class="bg-muted/30 p-6 md:p-8 flex-grow flex items-center justify-center border-b border-border min-h-[220px]"
              >
                {#if mod.id === "kinetic"}
                  <!-- Performance/Progression Vector Wireframe Mockup -->
                  <div
                    class="w-full max-w-lg bg-card border border-border rounded-xl p-4 shadow-sm font-mono text-[11px] text-muted-foreground"
                  >
                    <div
                      class="flex items-center justify-between border-b border-border pb-2 mb-3"
                    >
                      <span class="text-foreground font-bold"
                        >KINETIC ENGINE v0.1</span
                      >
                      <span class="text-primary font-mono">1RM COVARIANCE</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mb-4">
                      <div class="bg-muted p-2 rounded border border-border">
                        <span class="block text-[9px]">LONGITUDINAL SLOPE</span>
                        <span class="text-foreground font-bold text-xs"
                          >+1.42 kg/wk</span
                        >
                      </div>
                      <div class="bg-muted p-2 rounded border border-border">
                        <span class="block text-[9px]">CONFIDENCE INDEX</span>
                        <span class="text-chart-2 font-bold text-xs"
                          >95.4% (p&lt;0.01)</span
                        >
                      </div>
                      <div class="bg-muted p-2 rounded border border-border">
                        <span class="block text-[9px]">PDCAAS BIOMAX</span>
                        <span class="text-chart-4 font-bold text-xs"
                          >1.00 (Pure EAAs)</span
                        >
                      </div>
                    </div>
                    <!-- Mock chart drawing using HTML blocks -->
                    <div
                      class="h-24 flex items-end gap-1.5 border-b border-l border-border/80 pl-2 pb-1"
                    >
                      <div
                        class="w-full bg-primary/20 hover:bg-primary/40 h-8 rounded-t transition-all"
                      ></div>
                      <div
                        class="w-full bg-primary/20 hover:bg-primary/40 h-12 rounded-t transition-all"
                      ></div>
                      <div
                        class="w-full bg-primary/35 hover:bg-primary/55 h-14 rounded-t transition-all"
                      ></div>
                      <div
                        class="w-full bg-primary/50 hover:bg-primary/75 h-20 rounded-t transition-all"
                      ></div>
                      <div class="w-full bg-primary h-24 rounded-t relative">
                        <div
                          class="absolute -top-6 -left-4 bg-foreground text-background text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm whitespace-nowrap"
                        >
                          Current 144kg
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between text-[8px] mt-1">
                      <span>Wk 1</span>
                      <span>Wk 2</span>
                      <span>Wk 3</span>
                      <span>Wk 4</span>
                      <span>Wk 5 (Target)</span>
                    </div>
                  </div>
                {:else if mod.id === "clinical"}
                  <!-- Clinical Lab Bio Panel Mockup -->
                  <div
                    class="w-full max-w-lg bg-card border border-border rounded-xl p-4 shadow-sm font-mono text-[11px] text-muted-foreground"
                  >
                    <div
                      class="flex items-center justify-between border-b border-border pb-2 mb-3"
                    >
                      <span class="text-foreground font-bold"
                        >DIAGNOSTICS GATEWAY</span
                      >
                      <span class="text-chart-2 font-mono">LABS DETECTED</span>
                    </div>
                    <div class="space-y-3">
                      <div class="bg-muted p-2.5 rounded border border-border">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-foreground font-semibold"
                            >Total Testosterone (Free/Direct)</span
                          >
                          <span class="text-chart-2 font-bold">28.4 nmol/L</span
                          >
                        </div>
                        <div
                          class="h-1.5 bg-border rounded-full overflow-hidden relative"
                        >
                          <div
                            class="absolute left-[30%] w-[50%] h-full bg-muted-foreground/30"
                          ></div>
                          <div
                            class="h-full bg-chart-2"
                            style="width: 78%"
                          ></div>
                        </div>
                        <div
                          class="flex justify-between text-[8px] mt-1 text-muted-foreground"
                        >
                          <span>Ref: 8.4</span>
                          <span class="text-foreground">Optimal Zone</span>
                          <span>Ref: 28.7</span>
                        </div>
                      </div>

                      <div class="bg-muted p-2.5 rounded border border-border">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-foreground font-semibold"
                            >Apolipoprotein B (ApoB)</span
                          >
                          <span class="text-foreground font-bold">0.62 g/L</span
                          >
                        </div>
                        <div
                          class="h-1.5 bg-border rounded-full overflow-hidden relative"
                        >
                          <div
                            class="absolute left-[20%] w-[40%] h-full bg-muted-foreground/30"
                          ></div>
                          <div
                            class="h-full bg-primary"
                            style="width: 38%"
                          ></div>
                        </div>
                        <div
                          class="flex justify-between text-[8px] mt-1 text-muted-foreground"
                        >
                          <span>Low Risk: &lt; 0.80</span>
                          <span>Ref Range</span>
                          <span>High Risk: &gt; 1.20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {:else if mod.id === "operating"}
                  <!-- Operating Suite Console Mockup -->
                  <div
                    class="w-full max-w-lg bg-card border border-border rounded-xl p-4 shadow-sm font-mono text-[11px] text-muted-foreground"
                  >
                    <div
                      class="flex items-center justify-between border-b border-border pb-2 mb-3"
                    >
                      <span class="text-foreground font-bold"
                        >MONADA_OS // BUSINESS_CONTROLLER</span
                      >
                      <span class="text-chart-5 font-mono">SECURE SYSTEM</span>
                    </div>
                    <div class="space-y-2">
                      <div
                        class="flex items-center justify-between bg-muted/60 p-1.5 rounded border border-border"
                      >
                        <span class="text-foreground"
                          >✓ Registered: Monada Baltics OÜ</span
                        >
                        <span class="text-[9px] text-muted-foreground"
                          >EE149021-002</span
                        >
                      </div>
                      <div
                        class="flex items-center justify-between bg-muted/60 p-1.5 rounded border border-border"
                      >
                        <span class="text-foreground"
                          >✓ SEPA Instant Merchant Gateway</span
                        >
                        <span class="text-[9px] text-chart-2"
                          >ROUTING OPERATIONAL</span
                        >
                      </div>
                      <div
                        class="flex items-center justify-between bg-muted/60 p-1.5 rounded border border-border"
                      >
                        <span class="text-foreground"
                          >✓ Ledger Integrity Anchor</span
                        >
                        <span class="text-[9px] text-primary"
                          >0% CORPORATE TAX RETAINED</span
                        >
                      </div>
                    </div>
                    <div
                      class="mt-3 bg-muted p-2 rounded text-[10px] text-muted-foreground"
                    >
                      <span class="text-primary">system:</span> Direct entity control
                      interface initialized. Operational overhead calibrated to 0.00%.
                    </div>
                  </div>
                {:else if mod.id === "collaborative"}
                  <!-- Life Synergy Project Graph Mockup -->
                  <div
                    class="w-full max-w-lg bg-card border border-border rounded-xl p-4 shadow-sm font-mono text-[11px] text-muted-foreground"
                  >
                    <div
                      class="flex items-center justify-between border-b border-border pb-2 mb-3"
                    >
                      <span class="text-foreground font-bold"
                        >SYNERGY TASKGRAPH</span
                      >
                      <span class="text-chart-1 font-mono"
                        >WEIGHTED CRITICAL PATH</span
                      >
                    </div>
                    <div class="space-y-3">
                      <div class="p-2 border border-border bg-muted/30 rounded">
                        <div class="flex justify-between font-bold mb-1">
                          <span class="text-foreground"
                            >1. Verify Tallinn Diagnostics Space</span
                          >
                          <span class="text-primary">[TD = 8.8]</span>
                        </div>
                        <p class="text-[10px] text-muted-foreground">
                          Blocks Phase 1 Patient Intake. Requires physical
                          validation of lead-lined imaging space.
                        </p>
                      </div>

                      <div class="flex justify-center my-1">
                        <span class="text-muted-foreground text-xs">↓</span>
                      </div>

                      <div
                        class="p-2 border border-border/60 bg-muted/10 rounded opacity-75"
                      >
                        <div class="flex justify-between font-semibold mb-1">
                          <span>2. Phase 1 Patient Intake Live</span>
                          <span>[TD = 4.2]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Module Features Footer -->
              <div
                class="p-6 md:p-8 bg-muted/10 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {#each mod.features as feature}
                  <div class="flex items-start gap-2">
                    <!-- Dynamic Check Indicator using CSS variables -->
                    <svg
                      class="h-4 w-4 text-primary mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-xs text-muted-foreground leading-snug"
                      >{feature}</span
                    >
                  </div>
                {/each}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Technical Integrity Section -->
  <section id="architecture" class="py-16 lg:py-24 bg-muted/10">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mb-12">
        <h2
          class="text-xs font-bold tracking-widest text-primary uppercase mb-2"
        >
          Technical Rigor
        </h2>
        <p
          class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Engineered to be the most efficient system in existence.
        </p>
        <p class="mt-4 text-muted-foreground leading-relaxed">
          Monada is built with an uncompromising focus on raw throughput and low
          administrative friction. By engineering our entire software stack from
          the metal up, we bypass licensing bottlenecks, unnecessary middlemen,
          and outdated technical paradigms.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-xl border border-border bg-card">
          <div class="h-8 w-8 text-primary mb-4">
            <svg
              class="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h4 class="font-bold text-foreground mb-1">Unified Authentication</h4>
          <p class="text-xs text-muted-foreground">
            One persistent identity controls bio-telemetry, operating entities,
            diagnostics, and workspace pipelines. Zero friction.
          </p>
        </div>

        <div class="p-6 rounded-xl border border-border bg-card">
          <div class="h-8 w-8 text-primary mb-4">
            <svg
              class="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
            </svg>
          </div>
          <h4 class="font-bold text-foreground mb-1">Zero-Trust Auditing</h4>
          <p class="text-xs text-muted-foreground">
            Adversarial verification strategies natively built into logistics
            and health pathways ensure accuracy by design.
          </p>
        </div>

        <div class="p-6 rounded-xl border border-border bg-card">
          <div class="h-8 w-8 text-primary mb-4">
            <svg
              class="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </div>
          <h4 class="font-bold text-foreground mb-1">Direct Banking Flows</h4>
          <p class="text-xs text-muted-foreground">
            Native SEPA and local financial gateways bypass credit card
            networks. Minimum administrative leakage.
          </p>
        </div>

        <div class="p-6 rounded-xl border border-border bg-card">
          <div class="h-8 w-8 text-primary mb-4">
            <svg
              class="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 20h20M5 17V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12" />
            </svg>
          </div>
          <h4 class="font-bold text-foreground mb-1">
            Physical Infrastructure
          </h4>
          <p class="text-xs text-muted-foreground">
            We compile code to software, but our final endpoints are
            physical—integrating directly with diagnostic spaces and labs.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final Call to Action -->
  <!-- <section class="py-20 border-t border-border bg-card"> -->
  <!--   <div -->
  <!--     class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6" -->
  <!--   > -->
  <!--     <h2 -->
  <!--       class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl" -->
  <!--     > -->
  <!--       Ready to optimize? -->
  <!--     </h2> -->
  <!--     <p -->
  <!--       class="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed" -->
  <!--     > -->
  <!--       Establish your node inside the Monada ecosystem today. Get priority -->
  <!--       credentials, trace your bio-availability metrics, and initialize -->
  <!--       execution tools. -->
  <!--     </p> -->
  <!--     <div class="flex justify-center gap-4 pt-2"> -->
  <!--       <a -->
  <!--         href="/login" -->
  <!--         class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" -->
  <!--       > -->
  <!--         Initialize Console -->
  <!--       </a> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </section> -->

  <!-- Footer -->
  <footer class="border-t border-border bg-background py-8">
    <div
      class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono"
    >
      <div>© 2026 Monada. All rights reserved.</div>
      <div class="flex gap-6">
        <span class="hover:text-foreground transition-colors cursor-default"
          >monada.foundation</span
        >
        <!-- <span>Espoo // Tallinn</span> -->
      </div>
    </div>
  </footer>
</div>
