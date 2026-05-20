<script lang="ts">
  import { onMount } from "svelte";
  import type { UserProfile, LabTest, Order, FulfillmentMethod } from "$lib/types.js";

  // Shadcn UI Imports
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";

  // API Client helper
  async function post(path: string, body?: unknown) {
    const res = await fetch(`/api/health/${path}`, {
      method: "POST",
      credentials: "include",
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw Object.assign(new Error(json.error ?? res.statusText), {
        status: res.status,
      });
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // Reactive Svelte 5 State
  let profile = $state<UserProfile | null>(null);
  let availableTests = $state<LabTest[]>([]);
  let patientOrders = $state<Order[]>([]);
  let operatorOrders = $state<Order[]>([]);
  
  // Dialog Open States & Selected Items
  let orderDialogOpen = $state(false);
  let selectedTest = $state<LabTest | null>(null);
  let selectedMethod = $state<FulfillmentMethod>("partner_clinic");
  
  let resultsDialogOpen = $state(false);
  let activeResultsOrder = $state<Order | null>(null);

  let submitResultsDialogOpen = $state(false);
  let selectedOperatorOrder = $state<Order | null>(null);

  // Operator result submission state
  let newResultKey = $state("");
  let newResultValue = $state("");
  let enteredResults = $state<Record<string, string>>({});

  let loading = $state(true);
  let actionLoading = $state(false);
  let errorMessage = $state<string | null>(null);

  onMount(async () => {
    await initSession();
  });

  async function initSession() {
    loading = true;
    errorMessage = null;
    try {
      // 1. Resolve logged in user credentials
      profile = await post("profile"); 

      if (profile) {
        if (profile.role === "patient") {
          // 2a. Fetch patient specific view data
          const [tests, orders] = await Promise.all([
            post("tests/list"),
            post("orders/patient")
          ]);
          availableTests = tests || [];
          patientOrders = orders || [];
        } else if (profile.role === "operator") {
          // 2b. Fetch pending lab operator tasks
          operatorOrders = await post("orders/admin/list") || [];
        }
      }
    } catch (err: any) {
      errorMessage = err.message || "Unable to authorize session";
    } finally {
      loading = false;
    }
  }

  // Patient Actions
  function openOrderDialog(test: LabTest) {
    selectedTest = test;
    selectedMethod = "partner_clinic";
    orderDialogOpen = true;
  }

  async function placeOrder() {
    if (!selectedTest) return;
    actionLoading = true;
    try {
      await post("orders/create", {
        testId: selectedTest.id,
        fulfillmentMethod: selectedMethod,
      });
      orderDialogOpen = false;
      selectedTest = null;
      // Refresh patient queue
      patientOrders = await post("orders/patient") || [];
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      actionLoading = false;
    }
  }

  function openResults(order: Order) {
    activeResultsOrder = order;
    resultsDialogOpen = true;
  }

  // Operator Actions
  function openResultEntry(order: Order) {
    selectedOperatorOrder = order;
    enteredResults = {};
    newResultKey = "";
    newResultValue = "";
    submitResultsDialogOpen = true;
  }

  function addResultMetric() {
    if (newResultKey.trim() && newResultValue.trim()) {
      enteredResults[newResultKey.trim()] = newResultValue.trim();
      newResultKey = "";
      newResultValue = "";
    }
  }

  async function submitResults() {
    if (!selectedOperatorOrder) return;
    actionLoading = true;
    try {
      await post("orders/admin/complete", {
        orderId: selectedOperatorOrder.id,
        results: enteredResults,
      });
      submitResultsDialogOpen = false;
      selectedOperatorOrder = null;
      // Refresh operator list
      operatorOrders = await post("orders/admin/list") || [];
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      actionLoading = false;
    }
  }
</script>

<div class="container mx-auto max-w-6xl p-6">
  <!-- Top Navigation Header -->
  <div class="flex items-center justify-between border-b pb-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Monada Health</h1>
      <p class="text-sm text-neutral-500">Diagnostics & Lab Testing</p>
    </div>
    {#if profile}
      <div class="text-right">
        <p class="text-xs font-semibold text-neutral-900 dark:text-neutral-50">{profile.name}</p>
        <span class="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-500 uppercase font-mono tracking-wider">{profile.role}</span>
      </div>
    {/if}
  </div>

  {#if errorMessage}
    <div class="mb-4 p-4 text-sm bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50">
      {errorMessage}
    </div>
  {/if}

  {#if loading}
    <div class="text-sm text-neutral-500 py-4">Checking active credentials...</div>
  {:else if !profile}
    <div class="text-center py-12 border border-dashed rounded-lg">
      <h2 class="text-sm font-semibold">Authentication required</h2>
      <p class="text-xs text-neutral-500 mt-1">Please log in to continue.</p>
    </div>
  {:else}

    <!-- ================= PATIENT PORTAL VIEW ================= -->
    {#if profile.role === 'patient'}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Available Lab Tests Catalog -->
        <div class="md:col-span-2 space-y-4">
          <h2 class="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">Available Laboratory Tests</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each availableTests as test}
              <Card.Root>
                <Card.Header class="pb-3">
                  <div class="flex justify-between items-start gap-2">
                    <Card.Title class="text-sm font-semibold">{test.name}</Card.Title>
                    <span class="text-sm font-semibold">${test.price}</span>
                  </div>
                  <Card.Description class="text-xs mt-1 leading-normal">{test.description}</Card.Description>
                </Card.Header>
                <Card.Footer>
                  <Button class="w-full text-xs" size="sm" onclick={() => openOrderDialog(test)}>
                    Order Test
                  </Button>
                </Card.Footer>
              </Card.Root>
            {/each}
          </div>
        </div>

        <!-- Patient Orders Queue -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">Your Active & Completed Orders</h2>
          
          {#if patientOrders.length === 0}
            <p class="text-sm text-neutral-500 italic">No historical orders found.</p>
          {:else}
            <div class="space-y-3">
              {#each patientOrders as order}
                <Card.Root>
                  <Card.Header class="p-4 pb-2">
                    <div class="flex justify-between items-start">
                      <h4 class="text-xs font-semibold">{order.testName}</h4>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} class="text-[10px] uppercase font-mono py-0 px-1.5">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p class="text-[11px] text-neutral-500 mt-1">Method: <span class="capitalize">{order.fulfillmentMethod.replace('_', ' ')}</span></p>
                  </Card.Header>
                  <Card.Content class="px-4 pb-4 pt-2">
                    <span class="text-[9px] text-neutral-400 font-mono">ID: {order.id}</span>
                    {#if order.status === 'completed' && order.results}
                      <Button variant="outline" size="sm" class="w-full mt-3 text-xs" onclick={() => openResults(order)}>
                        View Results
                      </Button>
                    {/if}
                  </Card.Content>
                </Card.Root>
              {/each}
            </div>
          {/if}
        </div>
      </div>

    <!-- ================= LAB OPERATOR PORTAL VIEW ================= -->
    {:else if profile.role === 'operator'}
      <div class="space-y-4">
        <h2 class="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">Active Orders Queue</h2>
        
        <div class="border rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
          <Table.Root>
            <Table.Header class="bg-neutral-50 dark:bg-neutral-850">
              <Table.Row>
                <Table.Head class="text-xs">Order ID</Table.Head>
                <Table.Head class="text-xs">Required Test</Table.Head>
                <Table.Head class="text-xs">Collection Method</Table.Head>
                <Table.Head class="text-xs">Status</Table.Head>
                <Table.Head class="text-xs text-right">Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each operatorOrders as order}
                <Table.Row>
                  <Table.Cell class="font-mono text-[11px]">{order.id}</Table.Cell>
                  <Table.Cell class="font-medium text-xs">{order.testName}</Table.Cell>
                  <Table.Cell class="capitalize text-xs">{order.fulfillmentMethod.replace('_', ' ')}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'outline'} class="text-[10px] uppercase font-mono">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    {#if order.status !== 'completed'}
                      <Button size="sm" class="text-xs" onclick={() => openResultEntry(order)}>
                        Enter Results
                      </Button>
                    {:else}
                      <span class="text-xs text-neutral-400 font-medium pr-2">Done</span>
                    {/if}
                  </Table.Cell>
                </Table.Row>
              {/each}
              {#if operatorOrders.length === 0}
                <Table.Row>
                  <Table.Cell colspan={5} class="text-center text-neutral-500 py-8">
                    No orders waiting to be processed.
                  </Table.Cell>
                </Table.Row>
              {/if}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    {/if}

  {/if}
</div>

<!-- ================= DIALOGS ================= -->

<!-- 1. Patient: Place Order Configuration Modal -->
{#if selectedTest}
  <Dialog.Root bind:open={orderDialogOpen}>
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title>Configure Order</Dialog.Title>
        <Dialog.Description>
          Choose your fulfillment strategy for {selectedTest.name} (${selectedTest.price}).
        </Dialog.Description>
      </Dialog.Header>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="fulfillment-method">Collection Method</Label>
          <select 
            id="fulfillment-method"
            bind:value={selectedMethod}
            class="w-full text-xs p-2 border rounded-md bg-transparent dark:bg-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
          >
            <option value="partner_clinic">Visit Partner Clinic (Standard Blood Draw)</option>
            <option value="home_visit">Home Nurse Visit (Convenience Blood Draw)</option>
            <option value="home_kit">Self-Collection Mail-In Kit</option>
          </select>
        </div>
      </div>

      <Dialog.Footer class="gap-2 sm:gap-0">
        <Button variant="outline" size="sm" onclick={() => orderDialogOpen = false}>Cancel</Button>
        <Button size="sm" disabled={actionLoading} onclick={placeOrder}>
          {#if actionLoading}Placing Order...{:else}Confirm Order{/if}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<!-- 2. Patient: View Completed Test Results Modal -->
{#if activeResultsOrder}
  <Dialog.Root bind:open={resultsDialogOpen}>
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title>{activeResultsOrder.testName}</Dialog.Title>
        <Dialog.Description class="text-[11px]">
          Released: {activeResultsOrder.updatedAt}
        </Dialog.Description>
      </Dialog.Header>

      <div class="border rounded-md mt-2 max-h-60 overflow-y-auto divide-y dark:divide-neutral-800">
        {#each Object.entries(activeResultsOrder.results ?? {}) as [marker, value]}
          <div class="flex justify-between items-center p-3 text-xs">
            <span class="font-medium text-neutral-500 dark:text-neutral-400">{marker}</span>
            <span class="font-bold text-neutral-950 dark:text-neutral-50">{value}</span>
          </div>
        {/each}
      </div>

      <Dialog.Footer>
        <Button variant="outline" size="sm" class="w-full" onclick={() => resultsDialogOpen = false}>Close Panel</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<!-- 3. Operator: Enter Results Capture Modal -->
{#if selectedOperatorOrder}
  <Dialog.Root bind:open={submitResultsDialogOpen}>
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title>Log Test Metrics</Dialog.Title>
        <Dialog.Description class="text-xs">
          Order ID: {selectedOperatorOrder.id} ({selectedOperatorOrder.testName})
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-4 py-2">
        <!-- Live values visual block -->
        <div class="border rounded-md p-3 bg-neutral-50 dark:bg-neutral-950 space-y-1">
          <span class="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block">Captured Metrics</span>
          {#each Object.entries(enteredResults) as [key, val]}
            <div class="flex justify-between items-center text-xs py-0.5">
              <span class="text-neutral-600 dark:text-neutral-400">{key}</span>
              <span class="font-bold">{val}</span>
            </div>
          {/each}
          {#if Object.keys(enteredResults).length === 0}
            <span class="text-xs text-neutral-400 italic block">No metrics entered.</span>
          {/if}
        </div>

        <!-- Metric Inputs -->
        <div class="grid grid-cols-2 gap-2">
          <div class="grid gap-1.5">
            <Label for="metric-name" class="text-[10px]">Marker Name</Label>
            <Input id="metric-name" size="sm" type="text" placeholder="e.g. TSH" bind:value={newResultKey} />
          </div>
          <div class="grid gap-1.5">
            <Label for="metric-val" class="text-[10px]">Measured Value</Label>
            <Input id="metric-val" size="sm" type="text" placeholder="e.g. 1.8 uIU/mL" bind:value={newResultValue} />
          </div>
        </div>

        <Button variant="secondary" size="sm" class="w-full text-xs" onclick={addResultMetric}>
          + Add Entry
        </Button>
      </div>

      <Dialog.Footer class="gap-2 sm:gap-0">
        <Button variant="outline" size="sm" onclick={() => submitResultsDialogOpen = false}>Cancel</Button>
        <Button 
          size="sm" 
          disabled={Object.keys(enteredResults).length === 0 || actionLoading} 
          onclick={submitResults}
        >
          {#if actionLoading}Saving...{:else}Release Results{/if}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
