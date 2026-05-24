// This whole component file is experimental. Is not going to be used for now!
<script lang="ts">
  import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
  
  // Icon Subpath Imports matching project standard
  import PlusIcon from "@tabler/icons-svelte/icons/plus";
  import TrashIcon from "@tabler/icons-svelte/icons/trash";
  import EditIcon from "@tabler/icons-svelte/icons/edit";
  import InfoIcon from "@tabler/icons-svelte/icons/info-circle";
  import CalculatorIcon from "@tabler/icons-svelte/icons/calculator";
  import WalletIcon from "@tabler/icons-svelte/icons/wallet";
  import CoinsIcon from "@tabler/icons-svelte/icons/coins";
  import CodeIcon from "@tabler/icons-svelte/icons/code";
  import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
  import XIcon from "@tabler/icons-svelte/icons/x";

  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  // TypeScript Interfaces for the Excel-grade Ledger
  interface LedgerItem {
    id: string;
    key: string;       // valid JS variable name (e.g. rent, salaries)
    label: string;     // user description
    type: "capex" | "opex";
    valueType: "static" | "formula";
    rawValue: string;  // e.g. "5000" or "rent * 0.15" or "() => rent * 2"
    evaluatedValue: number | null;
    error: string | null;
    
    // Amortization & Financing properties for Capex
    amortize?: boolean;
    amortizationPeriod?: number; // in months
    financeMethod?: "own" | "loan";
    interestRate?: number; // annual percentage rate (e.g. 5)
    downPayment?: number;
  }

  // 1. Reactive State using Svelte 5 Runes
  let startingBudget = $state(100000);
  let viewMode = $state<"cash" | "accrual">("cash");
  let showCheatsheet = $state(false);

  // Modal Editing Dialog States
  let isDialogOpen = $state(false);
  let dialogMode = $state<"add_capex" | "add_opex" | "edit">("edit");
  let editingItem = $state<LedgerItem | null>(null);

  // Default ledger items displaying complex dependency chains
  let items = $state<LedgerItem[]>([
    {
      id: "cap-1",
      key: "server_setup",
      label: "Initial Server Hardware Setup",
      type: "capex",
      valueType: "static",
      rawValue: "5000",
      evaluatedValue: 5000,
      error: null,
      amortize: true,
      amortizationPeriod: 36,
      financeMethod: "loan",
      interestRate: 6,
      downPayment: 1000
    },
    {
      id: "cap-2",
      key: "office_furniture",
      label: "Office Space Renovation",
      type: "capex",
      valueType: "static",
      rawValue: "12000",
      evaluatedValue: 12000,
      error: null,
      amortize: true,
      amortizationPeriod: 48,
      financeMethod: "own",
      downPayment: 0
    },
    {
      id: "cap-3",
      key: "patents",
      label: "IP & Patent Filing Fees",
      type: "capex",
      valueType: "static",
      rawValue: "3500",
      evaluatedValue: 3500,
      error: null,
      amortize: false
    },
    {
      id: "op-1",
      key: "office_rent",
      label: "Monthly Office Lease",
      type: "opex",
      valueType: "static",
      rawValue: "2500",
      evaluatedValue: 2500,
      error: null
    },
    {
      id: "op-2",
      key: "team_salaries",
      label: "Core Engineering Salaries",
      type: "opex",
      valueType: "static",
      rawValue: "15000",
      evaluatedValue: 15000,
      error: null
    },
    {
      id: "op-3",
      key: "cloud_hosting",
      label: "AWS Hosting & Scaling Costs",
      type: "opex",
      valueType: "formula",
      rawValue: "server_setup_monthly + team_salaries * 0.05 + 150",
      evaluatedValue: null,
      error: null
    },
    {
      id: "op-4",
      key: "tax_provision",
      label: "Estimated Monthly Local Tax",
      type: "opex",
      valueType: "formula",
      rawValue: "(office_rent + team_salaries + cloud_hosting) * 0.08",
      evaluatedValue: null,
      error: null
    },
    {
      id: "op-5",
      key: "ad_campaign",
      label: "Performance Marketing Ad spend",
      type: "opex",
      valueType: "formula",
      rawValue: "() => team_salaries > 12000 ? 2500 : 800",
      evaluatedValue: null,
      error: null
    }
  ]);

  // 2. Financial Loan Amortization & Depreciation Calculators
  function calculateCapexMonthly(item: { amortize?: boolean; amortizationPeriod?: number; financeMethod?: "own" | "loan"; interestRate?: number; downPayment?: number }, val: number): number {
    if (!item.amortize || !item.amortizationPeriod || item.amortizationPeriod <= 0) {
      return 0;
    }
    
    const period = item.amortizationPeriod;
    const downPayment = item.downPayment || 0;
    const principal = Math.max(0, val - downPayment);
    
    if (item.financeMethod === "loan") {
      const annualRate = item.interestRate || 0;
      if (annualRate <= 0) {
        return Math.max(0, principal / period);
      }
      const monthlyRate = annualRate / 12 / 100;
      // PMT Formula: P * r * (1+r)^n / ((1+r)^n - 1)
      const pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, period)) / (Math.pow(1 + monthlyRate, period) - 1);
      return isNaN(pmt) ? 0 : Math.max(0, pmt);
    } else {
      // Linear depreciation/amortization of equity/own capital
      return Math.max(0, principal / period);
    }
  }

  // 3. Dynamic Safe Expression/Function Compiler
  function evaluateExpression(expression: string, env: Record<string, number>): number {
    let body = expression.trim();
    
    // Inject all environmental variables as standard JavaScript constants
    const keys = Object.keys(env);
    const declarations = keys.map(k => `const ${k} = env.${k};`).join('\n');
    
    let functionCode: string;
    if (body.includes('return')) {
      // Full JavaScript multi-line script or function body
      functionCode = `${declarations}\n${body}`;
    } else if (body.startsWith('(') && body.includes('=>')) {
      // Arrow function declaration - immediately invoked inside scope
      functionCode = `${declarations}\nreturn (${body})();`;
    } else {
      // Standard mathematical formula expression
      functionCode = `${declarations}\nreturn (${body});`;
    }
    
    const fn = new Function('env', functionCode);
    const val = fn(env);
    
    // If the returned value is a function, call it (safeguard for uninvolked declarations)
    if (typeof val === 'function') {
      return val();
    }
    
    return val;
  }

  // 4. Derived Reactive Calculations Engine
  let evaluatedItems = $derived.by(() => {
    // Clone states to keep evaluation block pure (preventing Svelte state mutation warnings)
    let result = items.map(item => ({
      ...item,
      evaluatedValue: null as number | null,
      error: null as string | null
    }));
    
    let env: Record<string, number> = {};
    
    // Step 1: Pre-resolve and inject all valid static entries
    for (let item of result) {
      if (item.valueType === 'static') {
        const val = parseFloat(item.rawValue);
        if (!isNaN(val)) {
          item.evaluatedValue = val;
          env[item.key] = val;
          // Pre-populate K_monthly for Capex static entries
          if (item.type === 'capex') {
            const monthly = calculateCapexMonthly(item, val);
            env[`${item.key}_monthly`] = monthly;
          }
        } else {
          item.error = "Invalid numerical input";
        }
      } else {
        item.error = "Pending evaluation";
      }
    }
    
    // Step 2: Iteratively compute and resolve dynamic formulas (Iterative topological solver)
    let remaining = result.filter(item => item.valueType === 'formula');
    let changed = true;
    let passes = 0;
    const maxPasses = remaining.length + 5;
    
    while (remaining.length > 0 && changed && passes < maxPasses) {
      changed = false;
      passes++;
      
      for (let i = 0; i < remaining.length; i++) {
        const item = remaining[i];
        
        // Ensure variable key name is a valid JS identifier to prevent compile errors
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(item.key)) {
          item.error = "Key must be a valid JS variable name";
          remaining.splice(i, 1);
          i--;
          continue;
        }
        
        try {
          const val = evaluateExpression(item.rawValue, env);
          if (typeof val === 'number' && !isNaN(val)) {
            item.evaluatedValue = val;
            item.error = null;
            env[item.key] = val;
            
            // Populate dynamic K_monthly variable in env
            if (item.type === 'capex') {
              const monthly = calculateCapexMonthly(item, val);
              env[`${item.key}_monthly`] = monthly;
            }
            
            remaining.splice(i, 1);
            i--;
            changed = true;
          } else {
            item.error = `Returned non-number: ${typeof val}`;
          }
        } catch (err: any) {
          // Captures dependency references. Unresolved in early passes, reported as error if passes exhaust
          item.error = err.message || "Evaluation error";
        }
      }
    }
    
    // Step 3: Flag remaining items as circular or unresolved reference errors
    for (let item of remaining) {
      if (item.error === "Pending evaluation" || item.error?.includes("is not defined")) {
        item.error = "Unresolved variable name or circular dependency";
      }
    }
    
    return result;
  });

  // 5. Dual-Basis Financial Summary Calculations
  let totals = $derived.by(() => {
    const capexTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error)
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const opexTotal = evaluatedItems
      .filter(i => i.type === 'opex' && !i.error)
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const capexLoanMonthlyTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'loan')
      .reduce((sum, i) => sum + calculateCapexMonthly(i, i.evaluatedValue || 0), 0);
      
    const capexDepreciationMonthlyTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'own')
      .reduce((sum, i) => sum + calculateCapexMonthly(i, i.evaluatedValue || 0), 0);
      
    const unamortizedCapexTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && !i.amortize)
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const ownCapexUpfrontTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'own')
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const loanCapexDownpaymentTotal = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'loan')
      .reduce((sum, i) => sum + (i.downPayment || 0), 0);
      
    const upfrontCashTotal = unamortizedCapexTotal + ownCapexUpfrontTotal + loanCapexDownpaymentTotal;
    
    const monthlyBurnCash = opexTotal + capexLoanMonthlyTotal;
    const monthlyBurnAccrual = opexTotal + capexDepreciationMonthlyTotal + capexLoanMonthlyTotal;
    
    let runwayMonths = 0;
    if (viewMode === 'cash') {
      runwayMonths = monthlyBurnCash > 0 ? (startingBudget - upfrontCashTotal) / monthlyBurnCash : Infinity;
    } else {
      runwayMonths = monthlyBurnAccrual > 0 ? (startingBudget - unamortizedCapexTotal) / monthlyBurnAccrual : Infinity;
    }
    
    const twelveMonthSpentCash = upfrontCashTotal + 12 * monthlyBurnCash;
    const twelveMonthSpentAccrual = unamortizedCapexTotal + 12 * monthlyBurnAccrual;
    
    return {
      capexTotal,
      opexTotal,
      capexLoanMonthlyTotal,
      capexDepreciationMonthlyTotal,
      upfrontCashTotal,
      monthlyBurnCash,
      monthlyBurnAccrual,
      runwayMonths,
      spent12Month: viewMode === 'cash' ? twelveMonthSpentCash : twelveMonthSpentAccrual,
      remainingRunway: Math.max(0, startingBudget - (viewMode === 'cash' ? twelveMonthSpentCash : twelveMonthSpentAccrual))
    };
  });

  // 6. Dynamic Cumulative Projection Series for Area Chart
  let projectionsChartData = $derived.by(() => {
    let data: any[] = [];
    
    const unamortizedCapex = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && !i.amortize)
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const ownCapexUpfront = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'own')
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const loanCapexDownPayments = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'loan')
      .reduce((sum, i) => sum + (i.downPayment || 0), 0);
      
    const monthlyOpex = evaluatedItems
      .filter(i => i.type === 'opex' && !i.error)
      .reduce((sum, i) => sum + (i.evaluatedValue || 0), 0);
      
    const monthlyLoanPayments = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'loan')
      .reduce((sum, i) => sum + calculateCapexMonthly(i, i.evaluatedValue || 0), 0);
      
    const monthlyDepreciation = evaluatedItems
      .filter(i => i.type === 'capex' && !i.error && i.amortize && i.financeMethod === 'own')
      .reduce((sum, i) => sum + calculateCapexMonthly(i, i.evaluatedValue || 0), 0);
      
    const upfrontCash = unamortizedCapex + ownCapexUpfront + loanCapexDownPayments;
    
    for (let m = 1; m <= 12; m++) {
      let spent = 0;
      if (viewMode === 'cash') {
        spent = upfrontCash + m * (monthlyOpex + monthlyLoanPayments);
      } else {
        spent = unamortizedCapex + m * (monthlyOpex + monthlyDepreciation + monthlyLoanPayments);
      }
      
      const remaining = Math.max(0, startingBudget - spent);
      
      data.push({
        date: new Date(Date.now() + (m - 1) * 30 * 24 * 60 * 60 * 1000),
        spent: Math.round(spent),
        remaining: Math.round(remaining)
      });
    }
    
    return data;
  });

  // 7. Operations Dialog Triggers & Handlers
  function openAddCapex() {
    dialogMode = "add_capex";
    editingItem = {
      id: "",
      key: "",
      label: "",
      type: "capex",
      valueType: "static",
      rawValue: "",
      evaluatedValue: null,
      error: null,
      amortize: false,
      amortizationPeriod: 36,
      financeMethod: "own",
      interestRate: 5,
      downPayment: 0
    };
    isDialogOpen = true;
  }

  function openAddOpex() {
    dialogMode = "add_opex";
    editingItem = {
      id: "",
      key: "",
      label: "",
      type: "opex",
      valueType: "static",
      rawValue: "",
      evaluatedValue: null,
      error: null
    };
    isDialogOpen = true;
  }

  function openEditItem(item: LedgerItem) {
    dialogMode = "edit";
    // Create copy so changes don't apply until saved
    editingItem = { ...item };
    isDialogOpen = true;
  }

  function handleSave() {
    if (!editingItem) return;
    
    // Key Variable Validation
    const cleanKey = editingItem.key.trim().toLowerCase().replace(/[^a-z0-9_$]/g, "_");
    if (!cleanKey || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(cleanKey)) {
      alert("Key must be a valid, alphanumeric JavaScript variable name!");
      return;
    }
    if (!editingItem.label.trim()) {
      alert("Please provide a description label!");
      return;
    }
    if (!editingItem.rawValue.trim()) {
      alert("Please enter a numeric amount or formula!");
      return;
    }
    
    editingItem.key = cleanKey;
    
    // Save or update in array
    if (dialogMode === "add_capex" || dialogMode === "add_opex") {
      // Check duplicate keys
      if (items.some(i => i.key === cleanKey)) {
        alert(`An item with key name "${cleanKey}" already exists in the ledger!`);
        return;
      }
      
      const newItem: LedgerItem = {
        ...editingItem,
        id: Math.random().toString(36).substring(7),
        evaluatedValue: null,
        error: null
      };
      items.push(newItem);
    } else {
      // Edit existing
      if (items.some(i => i.key === cleanKey && i.id !== editingItem!.id)) {
        alert(`Another item with key name "${cleanKey}" already exists!`);
        return;
      }
      const index = items.findIndex(i => i.id === editingItem!.id);
      if (index !== -1) {
        items[index] = { ...editingItem };
      }
    }
    
    isDialogOpen = false;
    editingItem = null;
  }

  function handleDeleteItem(id: string) {
    items = items.filter(i => i.id !== id);
  }

  function formatCurrency(v: number | null): string {
    if (v === null || isNaN(v)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(v);
  }
</script>

<!-- Outer Viewport Grid Container - Prevents overall scroll, enables structured split panes -->
<div class="h-[calc(100vh-80px)] flex flex-col gap-5 overflow-hidden">
  
  <!-- Header Bar -->
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3 shrink-0">
    <div>
      <h1 class="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
        <CalculatorIcon class="size-6 text-primary animate-pulse" />
        Business Ledger Simulator
      </h1>
      <p class="text-xs text-muted-foreground font-medium">Model capital financing, loan amortization, and dynamic expenses in real-time.</p>
    </div>

    <!-- Toggle Controls -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Starting Capital Input -->
      <div class="flex items-center gap-2 bg-card/60 border rounded-lg px-2.5 py-1 shadow-xs">
        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Runway Reserve</span>
        <div class="flex items-center">
          <span class="text-xs font-mono text-primary font-bold mr-0.5">$</span>
          <input 
            type="number" 
            bind:value={startingBudget} 
            class="w-20 bg-transparent text-xs font-mono font-extrabold text-foreground border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <!-- Basis Switcher Buttons -->
      <div class="inline-flex rounded-lg border bg-card/60 p-0.5 shadow-xs">
        <button 
          class="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-all duration-200 {viewMode === 'cash' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
          onclick={() => viewMode = "cash"}
        >
          <WalletIcon class="size-3" />
          Cash Flow
        </button>
        <button 
          class="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-all duration-200 {viewMode === 'accrual' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}"
          onclick={() => viewMode = "accrual"}
        >
          <CoinsIcon class="size-3" />
          P&L Accrual
        </button>
      </div>

      <!-- Cheatsheet Trigger -->
      <Button 
        variant="outline" 
        size="sm" 
        class="h-8 gap-1 text-[11px] font-bold" 
        onclick={() => showCheatsheet = !showCheatsheet}
      >
        <CodeIcon class="size-3" />
        Formulas Reference
      </Button>
    </div>
  </div>

  <!-- Main Viewport Split Grid -->
  <div class="grid gap-5 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
    
    <!-- Left Pane: Sticky Compact Summary (40% space) -->
    <div class="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar h-full min-h-0 shrink-0">
      
      <!-- Custom Compact Micro-Stats Grid -->
      <div class="grid grid-cols-2 gap-3 shrink-0">
        <!-- Budget Runway -->
        <div class="rounded-xl border bg-card/45 backdrop-blur-md p-3 flex flex-col justify-center gap-0.5 shadow-xs">
          <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Runway Reserve</span>
          <span class="text-md font-black text-foreground">{formatCurrency(startingBudget)}</span>
        </div>
        
        <!-- Monthly Burn -->
        <div class="rounded-xl border bg-card/45 backdrop-blur-md p-3 flex flex-col justify-center gap-0.5 shadow-xs">
          <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
            {viewMode === "cash" ? "Monthly Outflow" : "Monthly Burn (Accrual)"}
          </span>
          <span class="text-md font-black text-destructive">
            {formatCurrency(viewMode === "cash" ? totals.monthlyBurnCash : totals.monthlyBurnAccrual)}/mo
          </span>
        </div>

        <!-- Runway Duration -->
        <div class="rounded-xl border bg-card/45 backdrop-blur-md p-3 flex flex-col justify-center gap-0.5 shadow-xs">
          <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Estimated Runway</span>
          <span class="text-md font-black {totals.runwayMonths <= 3 ? 'text-destructive' : totals.runwayMonths <= 6 ? 'text-amber-500' : 'text-emerald-500'}">
            {totals.runwayMonths === Infinity ? "Infinite" : `${totals.runwayMonths.toFixed(1)} months`}
          </span>
        </div>

        <!-- Reserves Remaining -->
        <div class="rounded-xl border bg-card/45 backdrop-blur-md p-3 flex flex-col justify-center gap-0.5 shadow-xs">
          <span class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">12mo End Balance</span>
          <span class="text-md font-black {totals.remainingRunway <= 0 ? 'text-destructive' : 'text-emerald-500'}">
            {formatCurrency(totals.remainingRunway)}
          </span>
        </div>
      </div>

      <!-- Compact 12-Month Projections Line Chart -->
      <div class="rounded-xl border bg-card/25 backdrop-blur-sm p-3.5 flex-1 min-h-[220px]">
        <ChartAreaInteractive
          title="Projected Capital Runway (12 Months)"
          description="Cumulative spent vs remaining capital simulated across 12 months."
          referenceDate={new Date()}
          data={projectionsChartData}
          series={[
            { key: "spent", label: "Spent", color: "var(--destructive)" },
            { key: "remaining", label: "Reserves Left", color: "var(--primary)" },
          ]}
          ranges={[
            { value: "365d", label: "12 Months Simulation", days: 365 }
          ]}
        />
      </div>

      <!-- Environment Variables Sheet -->
      {#if showCheatsheet}
        <div class="rounded-xl border bg-card/65 backdrop-blur-md p-4 flex flex-col gap-3 shadow-sm transition-all duration-300 shrink-0">
          <div class="flex items-center justify-between border-b pb-1.5">
            <h3 class="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CalculatorIcon class="size-4 text-primary" />
              Active Variables Map
            </h3>
            <button onclick={() => showCheatsheet = false} class="text-muted-foreground hover:text-foreground">
              <XIcon class="size-3.5" />
            </button>
          </div>
          
          <div class="max-h-[140px] overflow-y-auto no-scrollbar space-y-1.5">
            {#each evaluatedItems.filter(i => !i.error) as item}
              <div class="flex items-center justify-between bg-muted/40 p-1.5 rounded text-[10px] font-mono border border-border/40">
                <span class="text-primary font-bold">{item.key}</span>
                <span class="text-muted-foreground">{formatCurrency(item.evaluatedValue)}</span>
              </div>
              {#if item.type === "capex" && item.amortize}
                <div class="flex items-center justify-between bg-muted/20 p-1.5 rounded text-[10px] font-mono border border-border/20 pl-4">
                  <span class="text-violet-500 font-bold">{item.key}_monthly</span>
                  <span class="text-muted-foreground">{formatCurrency(calculateCapexMonthly(item, item.evaluatedValue || 0))}/mo</span>
                </div>
              {/if}
            {/each}
          </div>
          
          <div class="text-[9px] text-muted-foreground bg-primary/[0.02] border border-primary/10 p-2 rounded leading-relaxed">
            💡 Reference variable keys in other dynamic formula scripts directly, e.g. <span class="text-foreground font-mono">office_rent + cloud_hosting</span>.
          </div>
        </div>
      {/if}
    </div>

    <!-- Right Pane: Scrollable List of Capex and Opex tables (60% space) -->
    <div class="lg:col-span-7 flex flex-col gap-5 overflow-y-auto pr-1 no-scrollbar h-full min-h-0">
      
      <!-- Capital Expenditures (Capex) Table Section -->
      <div class="rounded-xl border border-border/80 bg-card/35 backdrop-blur-md p-4 flex flex-col gap-3 shadow-xs">
        <div class="flex items-center justify-between border-b pb-2">
          <div>
            <h2 class="text-sm font-bold text-foreground">Capital Expenditures (Capex)</h2>
            <p class="text-[10px] text-muted-foreground">Upfront, one-time expenditures depreciated or loaned.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
              Capex Total: {formatCurrency(totals.capexTotal)}
            </span>
            <Button size="sm" class="h-7 text-[10px] font-bold gap-1" onclick={openAddCapex}>
              <PlusIcon class="size-3" />
              Add Capex
            </Button>
          </div>
        </div>

        <!-- High-density Capex Table -->
        <div class="overflow-x-auto rounded-lg border">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground tracking-wider border-b">
                <th class="p-2.5 font-bold">Key (ID)</th>
                <th class="p-2.5 font-bold">Description</th>
                <th class="p-2.5 font-bold">Financing & Amortization</th>
                <th class="p-2.5 text-right font-bold">Asset Cost</th>
                <th class="p-2.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y bg-card/10">
              {#each items.filter(i => i.type === "capex") as item}
                {@const evaluated = evaluatedItems.find(ei => ei.id === item.id)}
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-2.5 font-mono font-bold text-primary">{item.key}</td>
                  <td class="p-2.5 font-medium text-foreground">{item.label}</td>
                  <td class="p-2.5">
                    {#if item.amortize}
                      <span class="inline-flex items-center gap-1 bg-violet-500/10 text-violet-500 border border-violet-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                        {item.financeMethod === "loan" ? `Loan (${item.interestRate}% APR)` : "Equity"} • {item.amortizationPeriod}mo
                      </span>
                    {:else}
                      <span class="inline-flex items-center bg-muted border px-2 py-0.5 rounded-full text-[9px] font-mono text-muted-foreground font-semibold">
                        Immediate write-off
                      </span>
                    {/if}
                  </td>
                  <td class="p-2.5 text-right font-mono font-extrabold text-foreground">
                    {#if evaluated?.error}
                      <span class="text-destructive font-bold text-[10px]">⚠️ Error</span>
                    {:else}
                      {formatCurrency(evaluated?.evaluatedValue || 0)}
                    {/if}
                  </td>
                  <td class="p-2.5 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" class="size-7 hover:text-primary" onclick={() => openEditItem(item)}>
                        <EditIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="size-7 hover:text-destructive" onclick={() => handleDeleteItem(item.id)}>
                        <TrashIcon class="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              {/each}
              {#if items.filter(i => i.type === "capex").length === 0}
                <tr>
                  <td colspan="5" class="p-6 text-center text-xs text-muted-foreground italic">No capital expenditures added yet. Click Add Capex.</td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Operating Expenditures (Opex) Table Section -->
      <div class="rounded-xl border border-border/80 bg-card/35 backdrop-blur-md p-4 flex flex-col gap-3 shadow-xs">
        <div class="flex items-center justify-between border-b pb-2">
          <div>
            <h2 class="text-sm font-bold text-foreground">Operating Expenditures (Opex)</h2>
            <p class="text-[10px] text-muted-foreground">Recurring expenses and dynamic variable JS formula scripts.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
              Opex Total: {formatCurrency(totals.opexTotal)}/mo
            </span>
            <Button size="sm" class="h-7 text-[10px] font-bold gap-1 animate-shimmer" onclick={openAddOpex}>
              <PlusIcon class="size-3" />
              Add Opex
            </Button>
          </div>
        </div>

        <!-- High-density Opex Table -->
        <div class="overflow-x-auto rounded-lg border">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground tracking-wider border-b">
                <th class="p-2.5 font-bold">Key (ID)</th>
                <th class="p-2.5 font-bold">Description</th>
                <th class="p-2.5 font-bold">Type</th>
                <th class="p-2.5 font-bold">Calculation Formula</th>
                <th class="p-2.5 text-right font-bold">Monthly Result</th>
                <th class="p-2.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y bg-card/10">
              {#each items.filter(i => i.type === "opex") as item}
                {@const evaluated = evaluatedItems.find(ei => ei.id === item.id)}
                <tr class="hover:bg-muted/10 transition-colors">
                  <td class="p-2.5 font-mono font-bold text-primary">{item.key}</td>
                  <td class="p-2.5 font-medium text-foreground">{item.label}</td>
                  <td class="p-2.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border {item.valueType === 'formula' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' : 'bg-muted border-border text-muted-foreground'}">
                      {item.valueType === "formula" ? "JS Formula" : "Static"}
                    </span>
                  </td>
                  <td class="p-2.5 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                    {item.rawValue}
                  </td>
                  <td class="p-2.5 text-right">
                    {#if evaluated?.error}
                      <span class="inline-flex bg-destructive/10 text-destructive border border-destructive/20 rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold" title={evaluated.error}>
                        ⚠️ Error
                      </span>
                    {:else}
                      <span class="font-mono font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {formatCurrency(evaluated?.evaluatedValue || 0)}
                      </span>
                    {/if}
                  </td>
                  <td class="p-2.5 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" class="size-7 hover:text-primary" onclick={() => openEditItem(item)}>
                        <EditIcon class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="size-7 hover:text-destructive" onclick={() => handleDeleteItem(item.id)}>
                        <TrashIcon class="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              {/each}
              {#if items.filter(i => i.type === "opex").length === 0}
                <tr>
                  <td colspan="6" class="p-6 text-center text-xs text-muted-foreground italic">No operating expenditures added yet. Click Add Opex.</td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ========================================== -->
<!-- Highly Polished shadcn Dialog (Modal Form) -->
<!-- ========================================== -->
{#if isDialogOpen && editingItem}
  <Dialog.Root bind:open={isDialogOpen}>
    <Dialog.Content class="sm:max-w-[440px] bg-card border border-border/80 shadow-lg p-5">
      <Dialog.Header class="gap-1">
        <Dialog.Title class="text-lg font-black tracking-tight text-foreground">
          {dialogMode === "add_capex" ? "Add Capital Investment" : dialogMode === "add_opex" ? "Add Operating Cost" : "Edit Ledger Item"}
        </Dialog.Title>
        <Dialog.Description class="text-xs text-muted-foreground leading-normal">
          Configure variable keys, descriptive tags, and valuation formulas here. Recalculations evaluate instantly.
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-4 py-4 min-h-0">
        
        <!-- Key Variable Identifier -->
        <div class="space-y-1.5">
          <Label for="key" class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Variable Key (JS Identifier)</Label>
          <Input 
            id="key" 
            bind:value={editingItem.key} 
            placeholder="e.g. cloud_hosting" 
            class="h-9 font-mono text-xs text-primary"
          />
          {#if editingItem.key && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(editingItem.key.trim().toLowerCase().replace(/[^a-z0-9_$]/g, "_"))}
            <span class="text-[10px] text-destructive font-medium block">⚠️ Key must start with a letter and contain only alphanumeric values/underscores!</span>
          {/if}
        </div>

        <!-- Description Label -->
        <div class="space-y-1.5">
          <Label for="label" class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Description Label</Label>
          <Input 
            id="label" 
            bind:value={editingItem.label} 
            placeholder="e.g. AWS Servers & Database" 
            class="h-9 text-xs"
          />
        </div>

        <!-- Valuation Mode (Opex only) -->
        {#if editingItem.type === "opex"}
          <div class="space-y-1.5">
            <Label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Calculation Mode</Label>
            <div class="flex gap-2">
              <Button 
                variant={editingItem.valueType === "static" ? "default" : "outline"} 
                class="text-xs h-8.5 flex-1 font-bold"
                onclick={() => editingItem!.valueType = "static"}
              >
                Static Amount
              </Button>
              <Button 
                variant={editingItem.valueType === "formula" ? "default" : "outline"} 
                class="text-xs h-8.5 flex-1 font-bold"
                onclick={() => editingItem!.valueType = "formula"}
              >
                Dynamic Formula (JS)
              </Button>
            </div>
          </div>
        {/if}

        <!-- Raw Cost / Formula Script -->
        <div class="space-y-1.5">
          <Label for="rawValue" class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            {editingItem.valueType === "static" ? "Budget Value Amount ($)" : "JavaScript Formula Expression"}
          </Label>
          
          {#if editingItem.valueType === "static"}
            <div class="relative flex items-center">
              <span class="absolute left-3 text-xs font-mono font-bold text-muted-foreground select-none">$</span>
              <Input 
                id="rawValue" 
                type="text" 
                bind:value={editingItem.rawValue} 
                placeholder="2500" 
                class="h-9 pl-6.5 font-mono text-xs font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          {:else}
            <div class="relative flex items-center">
              <CodeIcon class="absolute left-3 size-3.5 text-primary select-none shrink-0" />
              <Input 
                id="rawValue" 
                type="text" 
                bind:value={editingItem.rawValue} 
                placeholder="e.g. server_setup_monthly + office_rent * 0.15" 
                class="h-9 pl-8 font-mono text-xs"
              />
            </div>
          {/if}
        </div>

        <!-- Capex Amortization & Financing Setup -->
        {#if editingItem.type === "capex"}
          <div class="border-t border-border/60 pt-3.5 space-y-3">
            <div class="flex items-center gap-2">
              <Checkbox 
                id="modal-amortize" 
                bind:checked={editingItem.amortize} 
              />
              <Label for="modal-amortize" class="text-xs font-extrabold text-foreground cursor-pointer select-none">Finance & Amortize Capital</Label>
            </div>

            {#if editingItem.amortize}
              <div class="space-y-3 bg-muted/40 rounded-lg p-3 border border-border/40">
                <!-- Funding source toggles -->
                <div class="space-y-1">
                  <Label class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Capital Funding Source</Label>
                  <div class="flex gap-2">
                    <Button 
                      variant={editingItem.financeMethod === "own" ? "default" : "outline"} 
                      class="text-[11px] h-8 flex-1 font-semibold"
                      onclick={() => editingItem!.financeMethod = "own"}
                    >
                      Equity (Own Capital)
                    </Button>
                    <Button 
                      variant={editingItem.financeMethod === "loan" ? "default" : "outline"} 
                      class="text-[11px] h-8 flex-1 font-semibold"
                      onclick={() => editingItem!.financeMethod = "loan"}
                    >
                      Debt (Bank Loan)
                    </Button>
                  </div>
                </div>

                <!-- Parameters list -->
                <div class="grid gap-3 grid-cols-2">
                  <div class="space-y-1">
                    <Label class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Term duration (Months)</Label>
                    <Input 
                      type="text" 
                      bind:value={editingItem.amortizationPeriod} 
                      placeholder="36" 
                      class="h-8 text-xs font-mono"
                    />
                  </div>

                  <div class="space-y-1">
                    <Label class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Down Payment ($)</Label>
                    <Input 
                      type="text" 
                      bind:value={editingItem.downPayment} 
                      placeholder="0" 
                      class="h-8 text-xs font-mono"
                    />
                  </div>

                  {#if editingItem.financeMethod === "loan"}
                    <div class="space-y-1 col-span-2">
                      <Label class="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Annual Interest Rate (APR %)</Label>
                      <Input 
                        type="text" 
                        bind:value={editingItem.interestRate} 
                        placeholder="5.0" 
                        class="h-8 text-xs font-mono"
                      />
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Action buttons -->
      <Dialog.Footer class="border-t border-border/50 pt-3 gap-2">
        <Button variant="outline" size="sm" class="h-9 font-bold text-xs" onclick={() => isDialogOpen = false}>Cancel</Button>
        <Button size="sm" class="h-9 font-bold text-xs" onclick={handleSave}>Save Changes</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
