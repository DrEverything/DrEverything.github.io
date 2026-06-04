<script lang="ts">
  // State for the email signup input
  let email = $state("");
  let selectedApp = $state("diagnostics");

  const apps = [
    {
      id: "diagnostics",
      name: "Monada Diagnostics",
      tagline: "Medical infrastructure without the gatekeepers.",
      description:
        "Order blood panels directly—undercutting legacy clinic prices by 70%. Sync with OmaKanta, upload paper PDFs from other countries, and view raw 3D MRI/CT scan slices in our cloud-based viewer. No paper, no CDs.",
      features: [
        "All-inclusive panels starting at €49 (Iron/Ferritin/Active B12)",
        "Zero-footprint HTML5 DICOM viewer for 3D MRI & CT scans",
        "Assay and unit normalization across global labs",
        "Direct connection to physical drawing points",
      ],
    },
    {
      id: "kinetic",
      name: "Monada Kinetic",
      tagline: "Physics-based strength and recovery modeling.",
      description:
        "A tracking suite designed for performance-focused individuals. Ditch the generic spreadsheets. Map strength using dynamic, non-linear velocity equations and track your actual bioavailable nutritional intake.",
      features: [
        "1RM predictions with confidence intervals using progression rate",
        "PDCAAS protein bioavailability and absorption curve modeling",
        "Direct API integration with wearable telemetry (Oura, Garmin)",
        "Zero tracking bloat—optimized for rapid input",
      ],
    },
    {
      id: "arena",
      name: "Monada Arena",
      tagline: "Real-time logic verification and argument tracking.",
      description:
        "Formative infrastructure for structured debate and academic comprehension. Built to replace messy town halls and passive lecturing with real-time opinion telemetry.",
      features: [
        "Live interactive proposition voting during arguments",
        "Real-time agreement/disagreement shift visualization",
        "Context-constrained LLM follow-up question synthesis",
        "Dual-use: Academic comprehension data & open debates",
      ],
    },
  ];

  function handleSignup(e: SubmitEvent) {
    e.preventDefault();
    // Redirect to auth pipeline with the email
    window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`;
  }
</script>

<div
  class="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground font-sans"
>
  <!-- Navigation Header -->
  <header
    class="border-b border-border py-4 px-6 md:px-12 flex justify-between items-center bg-card"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg"
      >
        M
      </div>
      <span class="text-xl font-bold tracking-tight"
        >MONADA <span class="text-xs text-muted-foreground font-mono ml-1"
          >OS</span
        ></span
      >
    </div>

    <div class="flex items-center gap-4">
      <a
        href="/auth/login"
        class="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md"
      >
        Login
      </a>
      <a
        href="/auth/signup"
        class="text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-4 py-2 rounded-md"
      >
        Get Started
      </a>
    </div>
  </header>

  <main class="flex-1 flex flex-col items-center">
    <!-- Hero Section -->
    <section
      class="w-full max-w-4xl px-6 md:px-12 pt-16 pb-12 text-center flex flex-col items-center"
    >
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs font-mono text-muted-foreground mb-6"
      >
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Phase 0.5 Active · Live in Finland & Estonia
      </div>

      <h1
        class="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.1]"
      >
        Your physical biology. <br class="hidden md:block" />Managed in one
        system.
      </h1>

      <p
        class="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed"
      >
        Monada is an asset-light diagnostic and performance operating system. We
        eliminate doctor gatekeepers, paper documents, and physical CDs. Sync
        your data, visualize your true longitudinal baselines, and control your
        own health.
      </p>

      <!-- Clean, Brutalist CTA -->
      <form
        onsubmit={handleSignup}
        class="w-full max-w-md flex flex-col sm:flex-row gap-2 border border-border p-1.5 rounded-lg bg-card shadow-sm"
      >
        <input
          type="email"
          placeholder="Enter your email"
          bind:value={email}
          required
          class="flex-1 bg-transparent px-3 py-2 text-sm outline-none focus:ring-0 placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          class="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:opacity-95 transition-opacity"
        >
          Create Account
        </button>
      </form>

      <p class="text-xs text-muted-foreground mt-3 font-mono">
        Free onboarding. Zero-friction bank authentication.
      </p>
    </section>

    <!-- Multi-App Ecosystem Section -->
    <section
      class="w-full max-w-6xl px-6 md:px-12 py-12 border-t border-border"
    >
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold tracking-tight mb-2">
            The Monada OS Ecosystem
          </h2>
          <p class="text-sm text-muted-foreground max-w-lg">
            We build modular, integrated modules for different aspects of human
            performance and logic. Same identity, same database, absolute data
            ownership.
          </p>
        </div>

        <!-- App Tabs -->
        <div
          class="flex gap-1 border border-border p-1 rounded-lg bg-card overflow-x-auto w-full md:w-auto"
        >
          {#each apps as app}
            <button
              onclick={() => (selectedApp = app.id)}
              class="px-4 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap {selectedApp ===
              app.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'}"
            >
              {app.name.split(" ")[1]}
            </button>
          {/each}
        </div>
      </div>

      <!-- Selected App Display -->
      {#each apps as app}
        {#if selectedApp === app.id}
          <div
            class="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-border bg-card rounded-xl p-6 md:p-8"
          >
            <!-- Left Panel -->
            <div class="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span
                  class="text-xs font-mono text-primary font-bold tracking-widest uppercase"
                  >{app.name}</span
                >
                <h3 class="text-xl md:text-2xl font-bold mt-2 mb-4">
                  {app.tagline}
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed mb-6">
                  {app.description}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <a
                  href="/auth/signup?app={app.id}"
                  class="text-xs font-mono bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Launch {app.name.split(" ")[1]} →
                </a>
              </div>
            </div>

            <!-- Right Panel (Features List) -->
            <div
              class="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center"
            >
              <span class="text-xs font-mono text-muted-foreground mb-4"
                >ENGINE SPECIFICATIONS</span
              >
              <ul class="space-y-4">
                {#each app.features as feature}
                  <li class="flex items-start gap-3 text-sm">
                    <svg
                      class="w-4 h-4 text-primary shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      {/each}
    </section>

    <!-- Cross-Border & Integration Section -->
    <section
      class="w-full max-w-6xl px-6 md:px-12 py-16 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-12 bg-muted/30"
    >
      <div class="flex flex-col justify-center">
        <div
          class="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center mb-4"
        >
          <svg
            class="w-5 h-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3 class="text-xl font-bold tracking-tight mb-3">
          Bring your own data.
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Trapped in other systems? Upload paper PDFs, photos of foreign lab
          results, or sync directly with the Finnish **OmaKanta** network via
          our secure REST API [1.1.9, 1.2.1]. Our cross-border parser instantly
          reads, translates, and normalizes different methods, assays, and units
          into your central, structured baseline [1.1.4, 1.1.9].
        </p>
      </div>

      <div class="flex flex-col justify-center">
        <div
          class="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center mb-4"
        >
          <svg
            class="w-5 h-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h3 class="text-xl font-bold tracking-tight mb-3">
          We track relative shifts, not population averages.
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Traditional healthcare compares your biology to sick and sedentary
          statistical averages [1.1.8]. We map your personal standard deviation
          ($Z$-scores). If your optimal resting heart rate shifts from 35 to 65,
          we flag the critical relative change, even if a generic clinic would
          dismiss you as "within normal range."
        </p>
      </div>
    </section>

    <!-- Simple Footer / Bottom Action -->
    <section class="w-full border-t border-border py-12 text-center bg-card">
      <div class="max-w-md mx-auto px-6 flex flex-col items-center">
        <h4 class="font-bold tracking-tight mb-2">
          Ready to take control of your biology?
        </h4>
        <p class="text-xs text-muted-foreground mb-6">
          Create your Monada OS account to get started.
        </p>
        <a
          href="/auth/signup"
          class="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-6 py-2.5 rounded-md text-sm font-semibold"
        >
          Create Free Account
        </a>
      </div>
    </section>
  </main>

  <footer
    class="border-t border-border py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center bg-background text-xs text-muted-foreground font-mono gap-4"
  >
    <div>© 2026 MONADA.</div>
    <div class="flex gap-4">
      <a href="/privacy" class="hover:text-foreground">Privacy</a>
      <a href="/terms" class="hover:text-foreground">Terms</a>
      <a href="/sys-status" class="hover:text-foreground">System Status</a>
    </div>
  </footer>
</div>
