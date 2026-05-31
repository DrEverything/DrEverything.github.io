<script lang="ts">
  import type {
    CapexEntry,
    OpexEntry,
    ThingThatPeopleBuy,
    CompanyBankAccount,
  } from "$lib/types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  // Mock initial data matching your scenario (e.g. food ingredients, medical tests)
  let capex: CapexEntry[] = $state([
    { id: "1", name: "Commercial Kitchen Setup", price: 12000, amount: 1 },
    { id: "2", name: "Tablet POS Systems", price: 450, amount: 2 },
  ]);

  let opex: OpexEntry[] = $state([
    { id: "1", name: "Kitchen Rent", price: 1500, amount: 1 },
    { id: "2", name: "Liability Insurance", price: 120, amount: 1 },
    { id: "3", name: "Marketing Overhead", price: 400, amount: 1 },
  ]);

  let thingsThatPeopleBuy: ThingThatPeopleBuy[] = $state([
    {
      name: "Signature Burger Meal",
      price: 15,
      unit_cost: 4.5,
      projected_sales_per_month: 600,
    },
    {
      name: "Analysis Blood Test",
      price: 120,
      unit_cost: 35.0,
      projected_sales_per_month: 120,
    },
  ]);

  let companyBankAccount: CompanyBankAccount = $state({
    initial_money: 15000,
    loans: [
      {
        name: "Startup Loan",
        initial_size: 10000,
        remaining_size: 10000,
        interest_rate: 5,
      },
    ],
    investments: [{ name: "Founder Funds", size: "10000" }],
  });

  // Modal Control States
  let isCapexOpen = $state(false);
  let isOpexOpen = $state(false);
  let isProductsOpen = $state(false);
  let isFundingOpen = $state(false);

  // New Item Temporary Buffers
  let newCapex = $state({ name: "", price: 0, amount: 1 });
  let newOpex = $state({ name: "", price: 0, amount: 1 });
  let newProduct = $state({
    name: "",
    price: 0,
    unit_cost: 0,
    projected_sales_per_month: 0,
  });
  let newLoan = $state({ name: "", initial_size: 0, interest_rate: 0 });
  let newInvestment = $state({ name: "", size: "" });

  // Formatting Helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // --- Derived Metrics ---
  const totalCapex = $derived(
    capex.reduce((sum, item) => sum + item.price * item.amount, 0),
  );

  const totalOpex = $derived(
    opex.reduce((sum, item) => sum + item.price * item.amount, 0),
  );

  // Gross Revenue (Total top-line sales)
  const totalRevenue = $derived(
    thingsThatPeopleBuy.reduce(
      (sum, item) => sum + item.price * item.projected_sales_per_month,
      0,
    ),
  );

  // Total Cost of Goods Sold (Variable Costs)
  const totalCOGS = $derived(
    thingsThatPeopleBuy.reduce(
      (sum, item) =>
        sum + (item.unit_cost || 0) * item.projected_sales_per_month,
      0,
    ),
  );

  // Gross Profit Margin = Gross Revenue - Variable Costs
  const grossProfit = $derived(totalRevenue - totalCOGS);

  const totalInvestments = $derived(
    companyBankAccount.investments.reduce(
      (sum, item) => sum + (parseFloat(item.size) || 0),
      0,
    ),
  );

  const totalLoans = $derived(
    companyBankAccount.loans.reduce((sum, item) => sum + item.initial_size, 0),
  );

  const totalFunding = $derived(
    companyBankAccount.initial_money + totalInvestments + totalLoans,
  );

  // Net Cash Flow: Gross Margin - Fixed Overhead (OPEX)
  const netMonthlyCashFlow = $derived(grossProfit - totalOpex);

  const remainingCapital = $derived(totalFunding - totalCapex);

  const runwayMetric = $derived(() => {
    if (netMonthlyCashFlow < 0) {
      const burn = Math.abs(netMonthlyCashFlow);
      const months = remainingCapital / burn;
      return {
        label: "Estimated Runway",
        value:
          isFinite(months) && months > 0
            ? `${months.toFixed(1)} Months`
            : "0 Months",
        color: "text-red-600 dark:text-red-400",
      };
    } else if (netMonthlyCashFlow > 0) {
      const payback = totalCapex / netMonthlyCashFlow;
      return {
        label: "Capex Payback Period",
        value: totalCapex === 0 ? "Immediate" : `${payback.toFixed(1)} Months`,
        color: "text-emerald-600 dark:text-emerald-400",
      };
    } else {
      return {
        label: "Cash Flow Status",
        value: "Net Zero Flow",
        color: "text-muted-foreground",
      };
    }
  });

  // --- Mutation Functions ---
  function addCapex() {
    if (!newCapex.name.trim()) return;
    capex.push({ id: crypto.randomUUID(), ...newCapex });
    newCapex = { name: "", price: 0, amount: 1 };
  }

  function addOpex() {
    if (!newOpex.name.trim()) return;
    opex.push({ id: crypto.randomUUID(), ...newOpex });
    newOpex = { name: "", price: 0, amount: 1 };
  }

  function addProduct() {
    if (!newProduct.name.trim()) return;
    thingsThatPeopleBuy.push({ ...newProduct });
    newProduct = {
      name: "",
      price: 0,
      unit_cost: 0,
      projected_sales_per_month: 0,
    };
  }

  function addLoan() {
    if (!newLoan.name.trim()) return;
    companyBankAccount.loans.push({
      name: newLoan.name,
      initial_size: newLoan.initial_size,
      remaining_size: newLoan.initial_size,
      interest_rate: newLoan.interest_rate,
    });
    newLoan = { name: "", initial_size: 0, interest_rate: 0 };
  }

  function addInvestment() {
    if (!newInvestment.name.trim()) return;
    companyBankAccount.investments.push({ ...newInvestment });
    newInvestment = { name: "", size: "" };
  }
</script>

<div class="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground">
  <!-- Top KPI Dashboard Cards -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >Total Funding</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span class="text-xl md:text-2xl font-bold"
          >{formatCurrency(totalFunding)}</span
        >
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >Total CAPEX</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span class="text-xl md:text-2xl font-bold"
          >{formatCurrency(totalCapex)}</span
        >
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >Net Cash Left</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span
          class="text-xl md:text-2xl font-bold {remainingCapital < 0
            ? 'text-red-500'
            : ''}"
        >
          {formatCurrency(remainingCapital)}
        </span>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >Gross Profit Margin</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span class="text-xl md:text-2xl font-bold text-emerald-500">
          {formatCurrency(grossProfit)}
        </span>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >Monthly OPEX</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span class="text-xl md:text-2xl font-bold"
          >{formatCurrency(totalOpex)}</span
        >
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="p-4 pb-1">
        <span
          class="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >{runwayMetric().label}</span
        >
      </Card.Header>
      <Card.Content class="p-4 pt-0">
        <span class="text-xl md:text-2xl font-bold {runwayMetric().color}">
          {runwayMetric().value}
        </span>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Gross vs Net Monthly Flow Explainer Banner -->
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border bg-card text-card-foreground"
  >
    <div>
      <h2 class="text-sm font-semibold text-muted-foreground">
        Monthly Gross Sales
      </h2>
      <p class="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
    </div>
    <div>
      <h2 class="text-sm font-semibold text-muted-foreground">
        Direct Variable Costs (COGS)
      </h2>
      <p class="text-xl font-bold text-red-500">-{formatCurrency(totalCOGS)}</p>
    </div>
    <div class="md:text-right">
      <h2 class="text-sm font-semibold text-muted-foreground">
        Net Monthly Cash Flow
      </h2>
      <span
        class="text-2xl font-black {netMonthlyCashFlow >= 0
          ? 'text-emerald-500'
          : 'text-red-500'}"
      >
        {netMonthlyCashFlow >= 0 ? "+" : ""}{formatCurrency(netMonthlyCashFlow)}
      </span>
    </div>
  </div>

  <!-- 4-Column Explorer -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1">
    <!-- CAPEX Block -->
    <Card.Root class="flex flex-col h-full justify-between">
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-4"
      >
        <div>
          <Card.Title class="text-lg">Capital Ex (CAPEX)</Card.Title>
          <span class="text-xs text-muted-foreground">One-off setup costs</span>
        </div>
        <Button size="sm" variant="outline" onclick={() => (isCapexOpen = true)}
          >Manage</Button
        >
      </Card.Header>
      <Card.Content class="flex-1 overflow-auto max-h-[350px] p-4 pt-0">
        <div class="space-y-3">
          {#each capex as item}
            <div
              class="flex justify-between items-center text-sm border-b pb-2"
            >
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-xs text-muted-foreground">
                  {formatCurrency(item.price)} &times; {item.amount}
                </p>
              </div>
              <span class="font-semibold"
                >{formatCurrency(item.price * item.amount)}</span
              >
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- OPEX Block -->
    <Card.Root class="flex flex-col h-full justify-between">
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-4"
      >
        <div>
          <Card.Title class="text-lg">Operational Ex (OPEX)</Card.Title>
          <span class="text-xs text-muted-foreground">Monthly fixed costs</span>
        </div>
        <Button size="sm" variant="outline" onclick={() => (isOpexOpen = true)}
          >Manage</Button
        >
      </Card.Header>
      <Card.Content class="flex-1 overflow-auto max-h-[350px] p-4 pt-0">
        <div class="space-y-3">
          {#each opex as item}
            <div
              class="flex justify-between items-center text-sm border-b pb-2"
            >
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-xs text-muted-foreground">
                  {formatCurrency(item.price)} &times; {item.amount}/mo
                </p>
              </div>
              <span class="font-semibold"
                >{formatCurrency(item.price * item.amount)}</span
              >
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Revenue Streams with explicit COGS -->
    <Card.Root class="flex flex-col h-full justify-between">
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-4"
      >
        <div>
          <Card.Title class="text-lg">Revenue & COGS</Card.Title>
          <span class="text-xs text-muted-foreground"
            >Products, margins, & sales</span
          >
        </div>
        <Button
          size="sm"
          variant="outline"
          onclick={() => (isProductsOpen = true)}>Manage</Button
        >
      </Card.Header>
      <Card.Content class="flex-1 overflow-auto max-h-[350px] p-4 pt-0">
        <div class="space-y-3">
          {#each thingsThatPeopleBuy as item}
            <div class="flex flex-col text-sm border-b pb-2">
              <div class="flex justify-between items-start">
                <p class="font-semibold">{item.name}</p>
                <span class="font-bold text-emerald-500">
                  {formatCurrency(
                    (item.price - item.unit_cost) *
                      item.projected_sales_per_month,
                  )}/mo
                </span>
              </div>
              <div
                class="flex justify-between text-xs text-muted-foreground mt-1"
              >
                <span
                  >Unit Margin: {formatCurrency(item.price - item.unit_cost)}
                  <span class="text-[10px]"
                    >({formatCurrency(item.price)} Price - {formatCurrency(
                      item.unit_cost,
                    )} Cost)</span
                  ></span
                >
                <span>{item.projected_sales_per_month} sold</span>
              </div>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Capitalization Block -->
    <Card.Root class="flex flex-col h-full justify-between">
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-4"
      >
        <div>
          <Card.Title class="text-lg">Capitalization</Card.Title>
          <span class="text-xs text-muted-foreground">Funding details</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onclick={() => (isFundingOpen = true)}>Manage</Button
        >
      </Card.Header>
      <Card.Content class="flex-1 overflow-auto max-h-[350px] p-4 pt-0">
        <div class="space-y-4">
          <div class="border-b pb-2">
            <div class="flex justify-between text-sm">
              <span class="font-medium">Initial Bank Balance</span>
              <span class="font-semibold"
                >{formatCurrency(companyBankAccount.initial_money)}</span
              >
            </div>
          </div>

          <div>
            <span
              class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1"
              >Investments</span
            >
            <div class="space-y-2">
              {#each companyBankAccount.investments as inv}
                <div class="flex justify-between text-sm text-muted-foreground">
                  <span>{inv.name}</span>
                  <span class="font-medium text-foreground"
                    >{formatCurrency(parseFloat(inv.size) || 0)}</span
                  >
                </div>
              {/each}
            </div>
          </div>

          <div>
            <span
              class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1"
              >Loans</span
            >
            <div class="space-y-2">
              {#each companyBankAccount.loans as loan}
                <div class="flex justify-between text-sm text-muted-foreground">
                  <div>
                    <span>{loan.name}</span>
                    <span class="text-xs block"
                      >Interest: {loan.interest_rate}%</span
                    >
                  </div>
                  <span class="font-medium text-foreground"
                    >{formatCurrency(loan.initial_size)}</span
                  >
                </div>
              {/each}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>

<!-- ==================== MANAGEMENT DIALOGS ==================== -->

<!-- CAPEX Dialog -->
<Dialog.Root bind:open={isCapexOpen}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Manage CAPEX</Dialog.Title>
      <Dialog.Description
        >One-off start-up capital expenditures.</Dialog.Description
      >
    </Dialog.Header>

    <div class="grid grid-cols-3 gap-2 py-4 border-b">
      <Input type="text" placeholder="Item Name" bind:value={newCapex.name} />
      <Input type="number" placeholder="Cost ($)" bind:value={newCapex.price} />
      <Input type="number" placeholder="Qty" bind:value={newCapex.amount} />
      <Button class="col-span-3 mt-1" onclick={addCapex}>Add Cost Item</Button>
    </div>

    <div class="max-h-60 overflow-y-auto space-y-2 pt-4">
      {#each capex as item, idx}
        <div class="flex items-center gap-2 border-b pb-2">
          <Input type="text" bind:value={item.name} class="flex-1" />
          <Input type="number" bind:value={item.price} class="w-24" />
          <Input type="number" bind:value={item.amount} class="w-16" />
          <Button
            variant="destructive"
            size="sm"
            onclick={() => capex.splice(idx, 1)}>Delete</Button
          >
        </div>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>

<!-- OPEX Dialog -->
<Dialog.Root bind:open={isOpexOpen}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Manage OPEX</Dialog.Title>
      <Dialog.Description
        >Ongoing overhead and operational fixed costs.</Dialog.Description
      >
    </Dialog.Header>

    <div class="grid grid-cols-3 gap-2 py-4 border-b">
      <Input type="text" placeholder="Expense Name" bind:value={newOpex.name} />
      <Input
        type="number"
        placeholder="Monthly Cost"
        bind:value={newOpex.price}
      />
      <Input type="number" placeholder="Qty" bind:value={newOpex.amount} />
      <Button class="col-span-3 mt-1" onclick={addOpex}>Add Expense</Button>
    </div>

    <div class="max-h-60 overflow-y-auto space-y-2 pt-4">
      {#each opex as item, idx}
        <div class="flex items-center gap-2 border-b pb-2">
          <Input type="text" bind:value={item.name} class="flex-1" />
          <Input type="number" bind:value={item.price} class="w-24" />
          <Input type="number" bind:value={item.amount} class="w-16" />
          <Button
            variant="destructive"
            size="sm"
            onclick={() => opex.splice(idx, 1)}>Delete</Button
          >
        </div>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>

<!-- Products & COGS Dialog -->
<Dialog.Root bind:open={isProductsOpen}>
  <Dialog.Content class="max-w-xl">
    <Dialog.Header>
      <Dialog.Title>Manage Revenue & COGS</Dialog.Title>
      <Dialog.Description
        >Configure individual product prices and internal unit costs (COGS).</Dialog.Description
      >
    </Dialog.Header>

    <div class="grid grid-cols-4 gap-2 py-4 border-b">
      <Input
        type="text"
        placeholder="Product / Service"
        bind:value={newProduct.name}
      />
      <Input
        type="number"
        placeholder="Price ($)"
        bind:value={newProduct.price}
      />
      <Input
        type="number"
        placeholder="Unit Cost ($)"
        bind:value={newProduct.unit_cost}
      />
      <Input
        type="number"
        placeholder="Est. Monthly Sales"
        bind:value={newProduct.projected_sales_per_month}
      />
      <Button class="col-span-4 mt-1" onclick={addProduct}>Add Product</Button>
    </div>

    <div class="max-h-64 overflow-y-auto space-y-2 pt-4">
      {#each thingsThatPeopleBuy as item, idx}
        <div class="flex flex-col gap-2 border-b pb-3">
          <div class="flex items-center gap-2">
            <Input type="text" bind:value={item.name} class="flex-1" />
            <Button
              variant="destructive"
              size="sm"
              onclick={() => thingsThatPeopleBuy.splice(idx, 1)}>Delete</Button
            >
          </div>
          <div class="grid grid-cols-3 gap-2 pl-2">
            <label class="text-[10px] text-muted-foreground"
              >Price
              <Input type="number" bind:value={item.price} class="h-8" />
            </label>
            <label class="text-[10px] text-muted-foreground"
              >Unit Cost (COGS)
              <Input type="number" bind:value={item.unit_cost} class="h-8" />
            </label>
            <label class="text-[10px] text-muted-foreground"
              >Proj. Sales Vol.
              <Input
                type="number"
                bind:value={item.projected_sales_per_month}
                class="h-8"
              />
            </label>
          </div>
        </div>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>

<!-- Capitalization Dialog -->
<Dialog.Root bind:open={isFundingOpen}>
  <Dialog.Content class="max-w-xl">
    <Dialog.Header>
      <Dialog.Title>Capitalization & Financing</Dialog.Title>
      <Dialog.Description
        >Edit initial cash buffers, equity rounds, and loan terms.</Dialog.Description
      >
    </Dialog.Header>

    <div class="space-y-6 pt-4">
      <div class="flex items-center gap-4 border-b pb-4">
        <span class="text-sm font-semibold w-1/3">Initial Bank Balance</span>
        <Input
          type="number"
          class="flex-1"
          bind:value={companyBankAccount.initial_money}
        />
      </div>

      <div class="border-b pb-4">
        <span class="text-sm font-semibold block mb-2">Equity Investment</span>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <Input
            type="text"
            placeholder="Investor Name"
            bind:value={newInvestment.name}
          />
          <Input
            type="number"
            placeholder="Investment ($)"
            bind:value={newInvestment.size}
          />
        </div>
        <Button class="w-full" size="sm" onclick={addInvestment}
          >Add Investment</Button
        >

        <div class="mt-3 space-y-2">
          {#each companyBankAccount.investments as inv, idx}
            <div class="flex items-center gap-2">
              <Input type="text" bind:value={inv.name} class="flex-1" />
              <Input type="text" bind:value={inv.size} class="w-32" />
              <Button
                variant="destructive"
                size="sm"
                onclick={() => companyBankAccount.investments.splice(idx, 1)}
                >Remove</Button
              >
            </div>
          {/each}
        </div>
      </div>

      <div>
        <span class="text-sm font-semibold block mb-2">Loans & Liabilities</span
        >
        <div class="grid grid-cols-3 gap-2 mb-3">
          <Input
            type="text"
            placeholder="Creditor Name"
            bind:value={newLoan.name}
          />
          <Input
            type="number"
            placeholder="Loan Size ($)"
            bind:value={newLoan.initial_size}
          />
          <Input
            type="number"
            placeholder="Interest Rate (%)"
            bind:value={newLoan.interest_rate}
          />
        </div>
        <Button class="w-full" size="sm" onclick={addLoan}>Add Loan</Button>

        <div class="mt-3 space-y-2">
          {#each companyBankAccount.loans as loan, idx}
            <div class="flex items-center gap-2">
              <Input type="text" bind:value={loan.name} class="flex-1" />
              <Input
                type="number"
                bind:value={loan.initial_size}
                class="w-24"
              />
              <Input
                type="number"
                bind:value={loan.interest_rate}
                class="w-16"
              />
              <Button
                variant="destructive"
                size="sm"
                onclick={() => companyBankAccount.loans.splice(idx, 1)}
                >Remove</Button
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
