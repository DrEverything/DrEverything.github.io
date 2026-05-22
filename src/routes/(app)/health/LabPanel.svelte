<script lang="ts">
  // --- TYPE DEFINITIONS ---
  interface Biomarker {
    id: string;
    name: string;
    unit: string;
    optimalRange: [number, number];
    clinicalRange: [number, number];
    description: string;
    whyItMatters: string;
    category: "hormones" | "metabolic" | "cardio_lipid" | "micronutrient";
  }

  interface LabRecord {
    date: string;
    values: Record<string, number>;
    logistics?: {
      tempLog: { time: string; temp: number }[];
      courierVerified: boolean;
      doubleReadStatus: "Verified" | "Pending";
    };
  }

  interface LabPackage {
    id: string;
    name: string;
    price: number;
    kelaEligible: boolean;
    estRefund: number;
    description: string;
    markers: string[]; // Biomarker IDs
  }

  // --- STATIC METADATA (Clinical-Grade Education) ---
  const BIOMARKERS: Record<string, Biomarker> = {
    free_testo: {
      id: "free_testo",
      name: "Free Testosterone",
      unit: "pg/mL",
      optimalRange: [15.0, 25.0],
      clinicalRange: [9.0, 30.0],
      category: "hormones",
      description:
        "The biologically active, unbound portion of testosterone driving muscle protein synthesis, bone density, and cognitive recovery.",
      whyItMatters:
        "Total testosterone can mislead if Sex Hormone-Binding Globulin (SHBG) is high. Free testosterone tells us what your tissues can actually utilize.",
    },
    shbg: {
      id: "shbg",
      name: "SHBG",
      unit: "nmol/L",
      optimalRange: [20.0, 45.0],
      clinicalRange: [10.0, 57.0],
      category: "hormones",
      description:
        "Sex Hormone-Binding Globulin is a glycoprotein that binds tightly to active androgens, regulating their free availability.",
      whyItMatters:
        "Elevated levels tie up free testosterone, rendering high total hormone levels functionally inert. Useful for auditing low-androgen symptoms.",
    },
    apob: {
      id: "apob",
      name: "Apolipoprotein B (ApoB)",
      unit: "mg/dL",
      optimalRange: [40, 75],
      clinicalRange: [50, 120],
      category: "cardio_lipid",
      description:
        "The structural protein found on all atherogenic (plaque-forming) lipid particles, including LDL, VLDL, and IDL.",
      whyItMatters:
        "Standard LDL cholesterol measurement estimates mass. ApoB measures absolute particle count. Particle count is the causal driver of cardiovascular disease progression.",
    },
    hba1c: {
      id: "hba1c",
      name: "HbA1c",
      unit: "%",
      optimalRange: [4.6, 5.3],
      clinicalRange: [4.0, 5.6],
      category: "metabolic",
      description:
        "Glycated hemoglobin measures your average blood glucose levels over the preceding 90–120 days by analyzing hemoglobin exposure.",
      whyItMatters:
        "Fasting glucose represents a single snapshot; HbA1c provides a stable, long-term metric of systemic glycemic control and insulin sensitivity.",
    },
    hscrp: {
      id: "hscrp",
      name: "hs-CRP",
      unit: "mg/L",
      optimalRange: [0.1, 0.8],
      clinicalRange: [0.0, 3.0],
      category: "cardio_lipid",
      description:
        "High-sensitivity C-Reactive Protein is an acute-phase protein synthesized by the liver, acting as a sensitive marker of systemic vascular inflammation.",
      whyItMatters:
        "Sub-clinical chronic vascular inflammation accelerates atherogenesis. Tracking this allows verification of anti-inflammatory protocols.",
    },
    vit_d: {
      id: "vit_d",
      name: "Vitamin D3 (25-hydroxy)",
      unit: "ng/mL",
      optimalRange: [50.0, 80.0],
      clinicalRange: [30.0, 100.0],
      category: "micronutrient",
      description:
        "A structural pre-hormone essential for immune regulation, endocrine integrity, physical force generation, and skeletal mineralization.",
      whyItMatters:
        "Sub-optimal levels are extremely common in Nordic regions during winter, significantly impairing endocrine balance and cellular recovery.",
    },
  };

  const PACKAGES: LabPackage[] = [
    {
      id: "hormone_panel",
      name: "Monada Hormone Panel",
      price: 55,
      kelaEligible: true,
      estRefund: 35,
      description:
        "Comprehensive analysis of physical performance and endocrine baseline.",
      markers: ["free_testo", "shbg"],
    },
    {
      id: "cardio_metabolic",
      name: "Atherogenic & Metabolic Risk",
      price: 35,
      kelaEligible: true,
      estRefund: 20,
      description: "Advanced lipids and systemic insulin resistance markers.",
      markers: ["apob", "hba1c", "hscrp"],
    },
    {
      id: "longevity_complete",
      name: "Comprehensive Baseline",
      price: 90,
      kelaEligible: true,
      estRefund: 55,
      description:
        "The fundamental biomarkers required to build a metabolic and vascular baseline.",
      markers: ["free_testo", "shbg", "apob", "hba1c", "hscrp", "vit_d"],
    },
  ];

  // --- HISTORIC PATIENT DATA (Sourced securely via Monada OS) ---
  const HISTORIC_RECORDS: LabRecord[] = [
    {
      date: "2025-10-12",
      values: {
        free_testo: 13.2,
        shbg: 52.1,
        apob: 104,
        hba1c: 5.5,
        hscrp: 1.8,
        vit_d: 28.0,
      },
      logistics: {
        tempLog: [
          { time: "07:30", temp: 4.1 },
          { time: "11:00", temp: 4.3 },
          { time: "14:20", temp: 4.2 },
        ],
        courierVerified: true,
        doubleReadStatus: "Verified",
      },
    },
    {
      date: "2026-01-20",
      values: {
        free_testo: 17.5,
        shbg: 41.2,
        apob: 88,
        hba1c: 5.1,
        hscrp: 0.9,
        vit_d: 55.4,
      },
      logistics: {
        tempLog: [
          { time: "08:00", temp: 3.9 },
          { time: "12:00", temp: 4.1 },
          { time: "15:15", temp: 4.0 },
        ],
        courierVerified: true,
        doubleReadStatus: "Verified",
      },
    },
    {
      date: "2026-05-18", // Most recent (May 2026)
      values: {
        free_testo: 21.8,
        shbg: 33.4,
        apob: 68,
        hba1c: 4.9,
        hscrp: 0.4,
        vit_d: 72.1,
      },
      logistics: {
        tempLog: [
          { time: "07:15", temp: 4.0 },
          { time: "10:45", temp: 4.2 },
          { time: "13:50", temp: 4.1 },
        ],
        courierVerified: true,
        doubleReadStatus: "Verified",
      },
    },
  ];

  // --- SVELTE 5 STATE MANAGEMENT ---
  let activeTab = $state<"analytics" | "order" | "audit">("analytics");
  let selectedMarkerId = $state<string>("apob");
  let cart = $state<Set<string>>(new Set());
  let homeDrawLocation = $state<string>("Espoo");
  let homeDrawAddress = $state<string>("");
  let homeDrawDate = $state<string>("2026-06-02");
  let checkoutSuccess = $state<boolean>(false);
  let checkedOutOrder = $state<any>(null);

  // --- DERIVED COMPUTED PROPERTIES ---
  const currentMarker = $derived(BIOMARKERS[selectedMarkerId]);

  // Calculate historical values array for active graph
  const markerHistory = $derived(
    HISTORIC_RECORDS.map((r) => ({
      date: r.date,
      value: r.values[selectedMarkerId] || 0,
    })),
  );

  const latestValue = $derived(
    HISTORIC_RECORDS[HISTORIC_RECORDS.length - 1].values[selectedMarkerId],
  );

  const cartTotal = $derived(
    Array.from(cart).reduce((sum, id) => {
      const pkg = PACKAGES.find((p) => p.id === id);
      return sum + (pkg ? pkg.price : 0);
    }, 0),
  );

  const kelaTotalRefund = $derived(
    Array.from(cart).reduce((sum, id) => {
      const pkg = PACKAGES.find((p) => p.id === id);
      return sum + (pkg ? pkg.estRefund : 0);
    }, 0),
  );

  // --- ACTIONS ---
  function selectMarker(id: string) {
    selectedMarkerId = id;
  }

  function toggleCart(id: string) {
    if (cart.has(id)) {
      cart.delete(id);
    } else {
      cart.add(id);
    }
    // Force reactivity updates
    cart = new Set(cart);
  }

  function processOrder() {
    if (cart.size === 0) return;
    checkedOutOrder = {
      packages: Array.from(cart).map((id) => PACKAGES.find((p) => p.id === id)),
      total: cartTotal,
      refund: kelaTotalRefund,
      location: homeDrawLocation,
      address:
        homeDrawAddress || "Default patient address registered in Monada OS",
      date: homeDrawDate,
    };
    checkoutSuccess = true;
    cart = new Set();
  }

  // Helper: check range relative to clinical & optimal limits
  function getValueStatus(
    val: number,
    marker: Biomarker,
  ): "low" | "optimal" | "borderline-high" | "high" {
    if (val < marker.clinicalRange[0]) return "low";
    if (val >= marker.optimalRange[0] && val <= marker.optimalRange[1])
      return "optimal";
    if (val > marker.clinicalRange[1]) return "high";
    return "borderline-high";
  }

  const scaleY = (val: number, minV: number, rangeDiff: number) => {
    const percent = (val - minV) / rangeDiff;
    return Math.max(10, Math.min(190, 190 - percent * 150));
  };

  const chartPoints = $derived(() => {
    const minV = currentMarker.clinicalRange[0];
    const maxV = currentMarker.clinicalRange[1];
    const rangeDiff = maxV - minV;
    return {
      p1Y: scaleY(markerHistory[0].value, minV, rangeDiff),
      p2Y: scaleY(markerHistory[1].value, minV, rangeDiff),
      p3Y: scaleY(markerHistory[2].value, minV, rangeDiff),
    };
  });
</script>

<div
  class="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans bg-background text-foreground transition-colors duration-200"
>
  <!-- CORE HERO & NAV HEADER -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border"
  >
    <div>
      <div class="flex items-center gap-2">
        <span
          class="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full"
        >
          Monada OS Phase 1
        </span>
        <span class="text-xs text-muted-foreground"
          >• Diagnostic Infrastructure</span
        >
      </div>
      <h1 class="text-3xl font-bold tracking-tight mt-1">
        Monada Biomarker & Labs Platform
      </h1>
      <p class="text-sm text-muted-foreground mt-0.5">
        High-fidelity longitudinal patient metrics & home-draw logistics
        automation.
      </p>
    </div>

    <!-- Shadcn Styled Tab-Switcher (Controlled State) -->
    <div
      class="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full md:w-auto"
    >
      <button
        onclick={() => {
          activeTab = "analytics";
          checkoutSuccess = false;
        }}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {activeTab ===
        'analytics'
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground'}"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
          /></svg
        >
        Biomarker Analytics
      </button>
      <button
        onclick={() => {
          activeTab = "order";
        }}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {activeTab ===
        'order'
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground'}"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        Order Labs
      </button>
      <button
        onclick={() => {
          activeTab = "audit";
        }}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {activeTab ===
        'audit'
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground'}"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          /></svg
        >
        Adversarial Audit
      </button>
    </div>
  </div>

  <!-- MAIN DYNAMIC REGION -->
  {#if activeTab === "analytics"}
    <!-- TAB 1: BIOMARKER ANALYTICS & LONGITUDINAL TRENDS -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Biomarker Selection Sidebar List (Left 4 cols) -->
      <div class="lg:col-span-4 space-y-4">
        <h3
          class="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Monitored Biomarkers
        </h3>
        <div class="grid grid-cols-1 gap-2">
          {#each Object.values(BIOMARKERS) as marker}
            {@const value =
              HISTORIC_RECORDS[HISTORIC_RECORDS.length - 1].values[marker.id]}
            {@const status = getValueStatus(value, marker)}
            <button
              onclick={() => selectMarker(marker.id)}
              class="w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center bg-card hover:bg-accent/40 hover:scale-[1.01] duration-150 {selectedMarkerId ===
              marker.id
                ? 'border-primary ring-1 ring-primary'
                : 'border-border'}"
            >
              <div class="space-y-1">
                <span class="text-xs font-mono text-muted-foreground uppercase"
                  >{marker.category}</span
                >
                <h4 class="font-semibold text-sm leading-none">
                  {marker.name}
                </h4>
                <p class="text-xs text-muted-foreground">
                  Optimal: {marker.optimalRange[0]}–{marker.optimalRange[1]}
                  {marker.unit}
                </p>
              </div>
              <div class="text-right">
                <div class="text-lg font-mono font-bold">
                  {value}
                  <span class="text-xs font-light text-muted-foreground"
                    >{marker.unit}</span
                  >
                </div>
                <span
                  class="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md mt-1
                  {status === 'optimal'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : ''}
                  {status === 'low'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : ''}
                  {status === 'borderline-high'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                    : ''}
                  {status === 'high'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    : ''}"
                >
                  {status}
                </span>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Detail Panel & Longitudinal Chart (Right 8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <div
          class="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm"
        >
          <!-- Detailed Header -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border"
          >
            <div>
              <span class="text-xs font-mono text-primary font-bold uppercase"
                >{currentMarker.category} metric</span
              >
              <h2 class="text-2xl font-bold">{currentMarker.name} Detail</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Optimal Target: <span
                  class="font-mono text-foreground font-semibold"
                  >{currentMarker.optimalRange[0]} – {currentMarker
                    .optimalRange[1]}
                  {currentMarker.unit}</span
                >
              </p>
            </div>
            <div
              class="bg-muted p-4 rounded-lg text-right font-mono min-w-[140px]"
            >
              <div class="text-xs text-muted-foreground uppercase">
                Current Value
              </div>
              <div class="text-2xl font-black text-primary">
                {latestValue}
                <span class="text-sm font-normal text-muted-foreground"
                  >{currentMarker.unit}</span
                >
              </div>
            </div>
          </div>

          <!-- Deep-Dive Scientific Descriptions (Client Education) -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/40 p-4 rounded-xl border border-border/60"
          >
            <div>
              <h4
                class="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"
              >
                <svg
                  class="w-3.5 h-3.5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  /></svg
                >
                Physiological Definition
              </h4>
              <p class="text-sm mt-1.5 leading-relaxed text-card-foreground">
                {currentMarker.description}
              </p>
            </div>
            <div>
              <h4
                class="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"
              >
                <svg
                  class="w-3.5 h-3.5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  /></svg
                >
                Why It Matters For Agency
              </h4>
              <p class="text-sm mt-1.5 leading-relaxed text-card-foreground">
                {currentMarker.whyItMatters}
              </p>
            </div>
          </div>

          <!-- Beautiful Clean Custom SVG Line Chart for Svelte 5 (No chart external dependency failures) -->
          <div class="space-y-3">
            <h3
              class="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                /></svg
              >
              Longitudinal Calibration (Historic Trend)
            </h3>

            <div
              class="relative bg-muted/20 border border-border rounded-xl p-4 md:p-6"
            >
              <!-- Inline Dynamic SVG Graph -->
              <svg
                class="w-full h-48 overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                <!-- Grid Lines -->
                <line
                  x1="0"
                  y1="170"
                  x2="600"
                  y2="170"
                  stroke="currentColor"
                  class="text-border/40"
                  stroke-dasharray="3"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="600"
                  y2="100"
                  stroke="currentColor"
                  class="text-border/40"
                  stroke-dasharray="3"
                />
                <line
                  x1="0"
                  y1="30"
                  x2="600"
                  y2="30"
                  stroke="currentColor"
                  class="text-border/40"
                  stroke-dasharray="3"
                />

                <!-- Draw Trend Path Line -->
                <path
                  d="M 50 {chartPoints().p1Y} L 300 {chartPoints().p2Y} L 550 {chartPoints().p3Y}"
                  fill="none"
                  stroke="var(--primary)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- Data Plot Circles -->
                <circle
                  cx="50"
                  cy={chartPoints().p1Y}
                  r="6"
                  fill="var(--background)"
                  stroke="var(--primary)"
                  stroke-width="3"
                />
                <circle
                  cx="300"
                  cy={chartPoints().p2Y}
                  r="6"
                  fill="var(--background)"
                  stroke="var(--primary)"
                  stroke-width="3"
                />
                <circle
                  cx="550"
                  cy={chartPoints().p3Y}
                  r="6"
                  fill="var(--background)"
                  stroke="var(--primary)"
                  stroke-width="3"
                />

                <!-- Text markers on graph nodes -->
                <text
                  x="50"
                  y={chartPoints().p1Y - 15}
                  text-anchor="middle"
                  class="fill-foreground font-mono font-bold text-xs"
                  >{markerHistory[0].value}</text
                >
                <text
                  x="300"
                  y={chartPoints().p2Y - 15}
                  text-anchor="middle"
                  class="fill-foreground font-mono font-bold text-xs"
                  >{markerHistory[1].value}</text
                >
                <text
                  x="550"
                  y={chartPoints().p3Y - 15}
                  text-anchor="middle"
                  class="fill-foreground font-mono font-bold text-xs"
                  >{markerHistory[2].value}</text
                >
              </svg>

              <!-- X-Axis Labels -->
              <div
                class="flex justify-between mt-2 px-6 text-xs text-muted-foreground font-mono"
              >
                <span>{markerHistory[0].date}</span>
                <span>{markerHistory[1].date}</span>
                <span>{markerHistory[2].date}</span>
              </div>
            </div>
          </div>

          <!-- Optimization Recommendation Box -->
          <div
            class="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-primary shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <div>
              <h4 class="font-bold text-sm">
                Monada Optimization Intelligence
              </h4>
              <p class="text-xs leading-relaxed text-muted-foreground mt-0.5">
                Your historical trajectory for <strong class="text-foreground"
                  >{currentMarker.name}</strong
                >
                shows consistent biochemical progression.
                {#if selectedMarkerId === "apob"}
                  ApoB reduction from 104 to 68 mg/dL represents an estimated
                  40% reduction in lifetime relative cardiovascular hazard
                  profile. Maintained optimal lipid targets are achieved.
                {:else if selectedMarkerId === "free_testo"}
                  Free testosterone shows a solid baseline shift upward.
                  Continue monitoring sleep quality and training load limits.
                {:else}
                  Current longitudinal trends represent robust cellular
                  adaptations aligned with active protocol parameters.
                {/if}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if activeTab === "order"}
    <!-- TAB 2: HIGH-DENSITY LAB ORDERING MODULE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Selection Cards (Left 8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <div>
          <h2 class="text-xl font-bold tracking-tight">
            On-Demand Lab Biomarker Packages
          </h2>
          <p class="text-sm text-muted-foreground mt-1">
            Select diagnostic panels to coordinate custom direct-to-home blood
            collection.
          </p>
        </div>

        {#if checkoutSuccess && checkedOutOrder}
          <!-- Order Confirmation Screen -->
          <div
            class="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-4"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  /></svg
                >
              </div>
              <div>
                <h3 class="font-bold text-lg text-emerald-400">
                  Home Draw Dispatch Initiated
                </h3>
                <p class="text-xs text-muted-foreground">
                  Order ID: MON-{(Math.random() * 100000).toFixed(0)}-EST
                </p>
              </div>
            </div>

            <div class="border-t border-emerald-500/20 pt-4 space-y-2 text-sm">
              <p>
                <strong>Scheduled Appointment:</strong>
                {checkedOutOrder.date} in
                <strong class="text-primary">{checkedOutOrder.location}</strong>
              </p>
              <p>
                <strong>Logistics Address:</strong>
                {checkedOutOrder.address}
              </p>
              <p>
                <strong>Total SEPA Instant Payment Received:</strong>
                €{checkedOutOrder.total}
              </p>
              <p
                class="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border"
              >
                ⚠️ <strong>Monada OS Compliance Automation:</strong>
                Pre-validated against Finnish Kela database. Estimated Kela reimbursement
                of €{checkedOutOrder.refund} will be automated upon result delivery.
                You won't have to fill out paper forms.
              </p>
            </div>

            <button
              onclick={() => {
                checkoutSuccess = false;
              }}
              class="inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 text-xs font-medium"
            >
              Order Additional Panels
            </button>
          </div>
        {/if}

        <div class="grid grid-cols-1 gap-4">
          {#each PACKAGES as pkg}
            {@const isAdded = cart.has(pkg.id)}
            <div
              class="bg-card border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-primary/50 {isAdded
                ? 'border-primary bg-primary/5'
                : 'border-border'}"
            >
              <div class="space-y-2 max-w-xl">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg leading-tight">{pkg.name}</h3>
                  {#if pkg.kelaEligible}
                    <span
                      class="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-primary/20 text-primary uppercase"
                      >Kela Reimbursable</span
                    >
                  {/if}
                </div>
                <p class="text-xs text-muted-foreground">{pkg.description}</p>

                <!-- Display included markers in small badges -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  {#each pkg.markers as markerId}
                    <span
                      class="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/40"
                    >
                      {BIOMARKERS[markerId]?.name || markerId}
                    </span>
                  {/each}
                </div>
              </div>

              <div
                class="flex items-center md:flex-col justify-between w-full md:w-auto shrink-0 md:text-right gap-4 md:gap-2"
              >
                <div>
                  <div class="text-2xl font-mono font-black text-foreground">
                    €{pkg.price}
                  </div>
                  <div class="text-[10px] font-mono text-muted-foreground">
                    Est. Net: €{pkg.price - pkg.estRefund}
                  </div>
                </div>

                <button
                  onclick={() => toggleCart(pkg.id)}
                  class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
                    {isAdded
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'}"
                >
                  {isAdded ? "Remove Panel" : "Select Panel"}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Checkout & Home Draw Nurse Dispatch Scheduling (Right 4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <div
          class="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm"
        >
          <h3
            class="font-bold text-md leading-none border-b border-border pb-3"
          >
            Home-Draw Dispatch Setup
          </h3>

          <!-- Selection inputs matching shadcn inputs styling -->
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="text-xs font-mono font-semibold text-muted-foreground uppercase"
                for="location">Location Hub (Finland/Estonia)</label
              >
              <select
                id="location"
                bind:value={homeDrawLocation}
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Espoo">Espoo (Registered Home Draw)</option>
                <option value="Helsinki">Helsinki (Registered Home Draw)</option
                >
                <option value="Vantaa">Vantaa (Registered Home Draw)</option>
                <option value="Tallinn">Tallinn (Clinic HQ)</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label
                class="text-xs font-mono font-semibold text-muted-foreground uppercase"
                for="address">Nurse Dispatch Address</label
              >
              <input
                id="address"
                type="text"
                placeholder="Street address, city, door code"
                bind:value={homeDrawAddress}
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <p class="text-[10px] text-muted-foreground leading-tight">
                Must reside in Finland or Estonia. High safety certifications
                guaranteed.
              </p>
            </div>

            <div class="space-y-1.5">
              <label
                class="text-xs font-mono font-semibold text-muted-foreground uppercase"
                for="date">Target Blood Draw Date</label
              >
              <input
                id="date"
                type="date"
                bind:value={homeDrawDate}
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <!-- Price Summary & Checkout Action -->
          <div class="space-y-3 pt-4 border-t border-border">
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">Selected Panels</span>
              <span class="font-mono font-bold text-foreground"
                >{cart.size}</span
              >
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">Kela Pre-Reimbursement</span>
              <span class="font-mono text-emerald-500 font-semibold"
                >-€{kelaTotalRefund}</span
              >
            </div>
            <div
              class="flex justify-between items-center pt-2 border-t border-dashed border-border"
            >
              <span class="font-semibold text-sm">Total Checkout Net</span>
              <span class="font-mono text-xl font-extrabold text-primary"
                >€{cartTotal}</span
              >
            </div>
          </div>

          <button
            onclick={processOrder}
            disabled={cart.size === 0}
            class="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
          >
            {#if cart.size === 0}
              No Panels Selected
            {:else}
              Execute SEPA Instant payment
            {/if}
          </button>

          <div
            class="p-3 bg-muted/40 rounded-lg text-[10px] text-muted-foreground space-y-1 leading-relaxed"
          >
            <p>
              <strong>Strict Logistics Framework:</strong> Sample collection completed
              by native registered health workers under strict legal post status.
              All samples cold-tracked at constant 4°C with dual biometric authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  {:else if activeTab === "audit"}
    <!-- TAB 3: THE ADVERSARIAL AUDIT TRAIL -->
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold tracking-tight">
          Systemic Transparency & Quality Auditing
        </h2>
        <p class="text-sm text-muted-foreground mt-1">
          Real-time log validation representing Monada zero-trust telemetry
          across samples transit.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Logistics Chain Status Card -->
        <div class="bg-card border rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            <h3 class="font-bold text-sm uppercase font-mono tracking-wider">
              Active cold chain (Helsinki - Tallinn)
            </h3>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Each sample tube incorporates a physical NFC tag tracking exact cold
            integrity and temperature limits during high-velocity container
            transit across the Gulf of Finland.
          </p>

          <div class="bg-muted p-4 rounded-lg space-y-3 font-mono text-xs">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Transit Container:</span>
              <span class="font-bold">MND-CONT-048</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground"
                >Continuous Temp tracking:</span
              >
              <span class="font-bold text-emerald-400"
                >4.1°C Mean (Optimal)</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">GPS Location:</span>
              <span class="font-bold">Gulf of Finland Carrier</span>
            </div>
          </div>
        </div>

        <!-- Blind Double-Read Quality Engine -->
        <div class="bg-card border rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <h3 class="font-bold text-sm uppercase font-mono tracking-wider">
              Adversarial Double Verification
            </h3>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            No medical consensus is blindly trusted. Monada runs automated
            clinical verification: two distinct, blind lab technicians confirm
            absolute value convergence before results post to Monada OS.
          </p>

          <div class="bg-muted p-4 rounded-lg space-y-3 font-mono text-xs">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Anonymized Audit Code:</span>
              <span class="font-bold">AUD-71-BLIND</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Technician A Delta:</span>
              <span class="font-bold">0.02% variance</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Technician B Delta:</span>
              <span class="font-bold">0.01% variance</span>
            </div>
          </div>
        </div>

        <!-- Patient Action / Dispute Re-Run Engine -->
        <div class="bg-card border rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 class="font-bold text-sm uppercase font-mono tracking-wider">
              Biological Anomaly Dispute
            </h3>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            If any biomarker reads abnormally against your historic rolling
            trajectory, trigger an automatic blind re-run of your cryopressed
            back-up blood vial instantly from the dashboard.
          </p>

          <button
            disabled
            class="w-full inline-flex h-9 items-center justify-center rounded-md bg-secondary text-muted-foreground cursor-not-allowed text-xs font-semibold tracking-wide"
          >
            No Anomalies Detected (Dispute Locked)
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
