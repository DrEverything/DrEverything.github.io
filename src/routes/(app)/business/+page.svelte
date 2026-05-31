<script lang="ts">
  import type {
    CapexEntry,
    OpexEntry,
    ThingThatPeopleBuy,
    CompanyBankAccount,
    BusinessPlanBaseEntry,
  } from "$lib/types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let capex: CapexEntry[] = $state([]);
  let opex: OpexEntry[] = $state([]);
  let thingsThatPeopleBuy: ThingThatPeopleBuy[] = $state([]);
  let companyBankAccount: CompanyBankAccount = $state({
    initial_money: 0,
    loans: [],
    investments: [],
  });

  function calculateTotal(array: BusinessPlanBaseEntry[]) {
    let total = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];

      total = total + element.amount * element.cost_for_each;
    }

    return total;
  }

  let capex_total = $derived(calculateTotal(capex));

  let opex_total = $derived(calculateTotal(opex));

</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>

<Input type="email" placeholder="Email" class="max-w-xs" />

<Button size="sm" variant="outline">Small</Button>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
