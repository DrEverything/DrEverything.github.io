<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Slider } from "$lib/components/ui/slider";
  import { Badge } from "$lib/components/ui/badge";
  import { Stethoscope, TrendingUp, ArrowDownRight, ArrowUpRight } from "@lucide/svelte";

  const numberInputClass =
    "h-8 bg-muted/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const capexFields = [
    { key: "quench", label: "Quench" },
    { key: "ups", label: "UPS / Power" },
    { key: "cage", label: "RF Cage" },
    { key: "cooling", label: "Cooling" },
    { key: "reno", label: "Renovation" },
    { key: "legal", label: "Legal" },
    { key: "marketing", label: "Marketing" },
    { key: "buffer", label: "Buffer" },
  ] as const;

  const opexFields = [
    { key: "rent", label: "Rent" },
    { key: "power", label: "Power" },
    { key: "helium", label: "Helium" },
    { key: "staff_salary", label: "Staff" },
    { key: "housing", label: "Housing" },
    { key: "chief", label: "Chief" },
    { key: "insurance", label: "Insurance" },
    { key: "software", label: "Software" },
    { key: "admin", label: "Admin" },
  ] as const;

  let machine = $state([350000]);
  let premiumMix = $state([25]);
  let dailyHours = $state([12]);
  let vatEnabled = $state(true);

  let capexInputs = $state({
    quench: 20000,
    ups: 20000,
    cage: 65000,
    cooling: 35000,
    reno: 25000,
    legal: 15000,
    marketing: 10000,
    buffer: 25000,
  });

  let opexInputs = $state({
    rent: 3000,
    power: 4500,
    helium: 5500,
    staff_salary: 4500,
    housing: 900,
    chief: 3000,
    insurance: 1000,
    software: 800,
    admin: 500,
  });

  let pricingInputs = $state({
    sharePrice: 250,
    standardPrice: 120,
    premiumPrice: 280,
    throughput: 2,
    workdays: 22,
  });

  const vatMultiplier = $derived(vatEnabled ? 1.255 : 1);

  const capex = $derived({
    Machine: machine[0] * vatMultiplier,
    Quench: capexInputs.quench * vatMultiplier,
    "UPS / Power": capexInputs.ups * vatMultiplier,
    "RF Cage": capexInputs.cage * vatMultiplier,
    Cooling: capexInputs.cooling * vatMultiplier,
    Renovation: capexInputs.reno * vatMultiplier,
    Legal: capexInputs.legal * vatMultiplier,
    Marketing: capexInputs.marketing * vatMultiplier,
    Buffer: capexInputs.buffer,
  });

  const opex = $derived({
    Rent: opexInputs.rent * vatMultiplier,
    Power: opexInputs.power * vatMultiplier,
    Helium: opexInputs.helium * vatMultiplier,
    Staff: opexInputs.staff_salary,
    Housing: opexInputs.housing,
    Chief: opexInputs.chief,
    Insurance: opexInputs.insurance,
    Software: opexInputs.software * vatMultiplier,
    Admin: opexInputs.admin * vatMultiplier,
  });

  const totalCapex = $derived(Object.values(capex).reduce((total, value) => total + value, 0));
  const totalOpex = $derived(Object.values(opex).reduce((total, value) => total + value, 0));

  const standardShare = $derived((100 - premiumMix[0]) / 100);
  const premiumShare = $derived(premiumMix[0] / 100);

  const standardVariableCost = 2;
  const premiumVariableCost = 60;

  const averagePrice = $derived(
    pricingInputs.standardPrice * standardShare + pricingInputs.premiumPrice * premiumShare,
  );
  const averageVariableCost = $derived(
    standardVariableCost * standardShare + premiumVariableCost * premiumShare,
  );
  const marginPerScan = $derived(averagePrice - averageVariableCost);

  const dailyVolume = $derived(dailyHours[0] * pricingInputs.throughput);
  const monthlyVolume = $derived(dailyVolume * pricingInputs.workdays);

  const breakEvenMonthly = $derived(marginPerScan > 0 ? Math.ceil(totalOpex / marginPerScan) : Infinity);
  const breakEvenDaily = $derived(
    pricingInputs.workdays > 0 ? Math.ceil(breakEvenMonthly / pricingInputs.workdays) : Infinity,
  );

  const monthlyRevenue = $derived(monthlyVolume * averagePrice);
  const monthlyVariableCost = $derived(monthlyVolume * averageVariableCost);
  const monthlyProfit = $derived(monthlyRevenue - monthlyVariableCost - totalOpex);

  const paybackMonths = $derived(monthlyProfit > 0 ? totalCapex / monthlyProfit : Infinity);
  const sharesNeeded = $derived(
    pricingInputs.sharePrice > 0 ? Math.ceil(totalCapex / pricingInputs.sharePrice) : Infinity,
  );

  const utilization = $derived(Math.min(100, (monthlyVolume / breakEvenMonthly) * 100));

  const currency = (value: number) => {
    if (!Number.isFinite(value)) return "∞";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const number = (value: number) => (!Number.isFinite(value) ? "∞" : value.toLocaleString());
</script>

<div class="min-h-screen bg-background text-foreground">
  <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
    <header class="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-primary p-2 text-primary-foreground">
          <Stethoscope class="size-5" />
        </div>
        <div>
          <h1 class="text-2xl font-bold">MRI Financial Planner</h1>
          <p class="text-sm text-muted-foreground">Simple controls with complete CAPEX/OPEX coverage.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Label for="vat" class="text-sm">VAT 25.5%</Label>
        <Checkbox id="vat" bind:checked={vatEnabled} />
        <Badge variant="secondary">Lean UI</Badge>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-12">
      <section class="space-y-4 lg:col-span-5 lg:sticky lg:top-6">
        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">CAPEX Inputs</Card.Title>
            <Card.Description>Total: {currency(totalCapex)}</Card.Description>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <Label>Machine</Label>
                <span class="font-medium">{currency(machine[0])}</span>
              </div>
              <Slider bind:value={machine} min={150000} max={1000000} step={25000} type="multiple" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              {#each capexFields as field}
                <div class="space-y-1">
                  <Label class="text-xs">{field.label}</Label>
                  <Input type="number" bind:value={capexInputs[field.key]} class={numberInputClass} />
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">OPEX Inputs</Card.Title>
            <Card.Description>Monthly: {currency(totalOpex)}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="grid grid-cols-2 gap-3">
              {#each opexFields as field}
                <div class="space-y-1">
                  <Label class="text-xs">{field.label}</Label>
                  <Input type="number" bind:value={opexInputs[field.key]} class={numberInputClass} />
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Pricing & Throughput</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1"><Label class="text-xs">Standard Price</Label><Input type="number" bind:value={pricingInputs.standardPrice} class={numberInputClass} /></div>
              <div class="space-y-1"><Label class="text-xs">Premium Price</Label><Input type="number" bind:value={pricingInputs.premiumPrice} class={numberInputClass} /></div>
              <div class="space-y-1"><Label class="text-xs">Scans / Hour</Label><Input type="number" bind:value={pricingInputs.throughput} class={numberInputClass} /></div>
              <div class="space-y-1"><Label class="text-xs">Workdays / Month</Label><Input type="number" bind:value={pricingInputs.workdays} class={numberInputClass} /></div>
              <div class="space-y-1"><Label class="text-xs">Share Price</Label><Input type="number" bind:value={pricingInputs.sharePrice} class={numberInputClass} /></div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm"><Label>Premium Mix</Label><span>{premiumMix[0]}%</span></div>
              <Slider bind:value={premiumMix} min={0} max={100} step={5} type="multiple" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm"><Label>Clinical Hours</Label><span>{dailyHours[0]} h/day</span></div>
              <Slider bind:value={dailyHours} min={4} max={24} step={1} type="multiple" />
            </div>
          </Card.Content>
        </Card.Root>
      </section>

      <section class="space-y-4 lg:col-span-7">
        <div class="grid gap-4 md:grid-cols-3">
          <Card.Root>
            <Card.Header>
              <Card.Description>Monthly Net</Card.Description>
              <Card.Title class={monthlyProfit >= 0 ? "text-green-600" : "text-red-500"}>{currency(monthlyProfit)}</Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="flex items-center gap-1 text-xs text-muted-foreground">
                {#if monthlyProfit >= 0}<ArrowUpRight class="size-3 text-green-500" /> Surplus{:else}<ArrowDownRight class="size-3 text-red-500" /> Deficit{/if}
              </p>
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Description>Break-even / Day</Card.Description>
              <Card.Title>{number(breakEvenDaily)} scans</Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="text-xs text-muted-foreground">Utilization: {utilization.toFixed(1)}%</p>
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Description>Payback</Card.Description>
              <Card.Title>{paybackMonths === Infinity ? "∞" : paybackMonths.toFixed(1)} months</Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="text-xs text-muted-foreground">Shares needed: {number(sharesNeeded)}</p>
            </Card.Content>
          </Card.Root>
        </div>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Monthly Breakdown</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-2 text-sm">
            <div class="flex justify-between"><span>Revenue</span><strong>{currency(monthlyRevenue)}</strong></div>
            <div class="flex justify-between"><span>Variable Costs</span><strong>-{currency(monthlyVariableCost)}</strong></div>
            <div class="flex justify-between"><span>Operating Costs</span><strong>-{currency(totalOpex)}</strong></div>
            <div class="flex justify-between border-t pt-2 text-base"><span class="font-semibold">Net</span><strong>{currency(monthlyProfit)}</strong></div>
          </Card.Content>
        </Card.Root>

      </section>
    </div>
  </div>
</div>
