<script lang="ts">
  import type {
    CapexEntry,
    OpexEntry,
    ThingThatPeopleBuy,
    CompanyBankAccount,
    BusinessPlanBaseEntry,
  } from "$lib/types";
  import { ArrowUpIcon, Delete, X } from "@lucide/svelte/icons";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  let capexEntries: CapexEntry[] = $state([]);
  let opexEntries: OpexEntry[] = $state([]);
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

      total = total + element.amount * element.price;
    }

    return total;
  }

  let calculatedTotals = $derived([
    {
      name: "Capital Ex",
      value: calculateTotal(capexEntries),
      entries: capexEntries,
    },
    {
      name: "Operational Ex",
      value: calculateTotal(opexEntries),
      entries: opexEntries,
    },
  ]);
</script>

<div class="flex flex-col gap-6">
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {#each calculatedTotals as total}
      <Dialog.Root>
        <Dialog.Trigger
          class="group text-left block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        >
          <Card.Root
            class="group-hover:border-primary/30 transition-colors duration-200"
          >
            <Card.Header>
              <Card.Title
                class="text-xs text-muted-foreground font-semibold tracking-wider"
                >{total.name}</Card.Title
              >
            </Card.Header>
            <Card.Content class="text-xl md:text-2xl font-bold">
              {total.value}
            </Card.Content>
          </Card.Root>
        </Dialog.Trigger>
        <Dialog.Content
          class="h-fit max-h-[90vh] w-fit max-w-[95vw] flex flex-col p-6 overflow-y-auto"
        >
          <Dialog.Header>
            <Dialog.Title>{total.name}</Dialog.Title>
          </Dialog.Header>

          <Separator />

          {#if total.entries.length === 0}
            <p>No Entries Yet!</p>
          {:else}
            {#each total.entries as entry}
              <div class="flex flex-row gap-4 items-center">
                <Dialog.Root>
                  <Dialog.Trigger
                    type="button"
                    class={buttonVariants({ variant: "outline" })}
                  >
                    {entry.amount}
                    {entry.name} for {entry.price}$ each
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                      <Dialog.Description>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </Dialog.Description>
                    </Dialog.Header>
                  </Dialog.Content>
                </Dialog.Root>
                <Button variant="outline" size="icon" class="rounded-full">
                  <X />
                </Button>
              </div>
            {/each}
          {/if}

          <Separator />

          <Dialog.Root>
            <Dialog.Trigger
              type="button"
              class={buttonVariants({ variant: "outline" })}
            >
              Add More
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </Dialog.Content>
      </Dialog.Root>
    {/each}
  </div>

  <!-- <Input type="text" placeholder="Name" class="" /> -->
  <!-- <Input type="number" placeholder="Price" class="" /> -->
  <!---->
  <!-- <Dialog.Root> -->
  <!--   <Dialog.Trigger -->
  <!--     type="button" -->
  <!--     class={buttonVariants({ variant: "outline" })} -->
  <!--   > -->
  <!--     Open Dialog -->
  <!--   </Dialog.Trigger> -->
  <!--   <Dialog.Content> -->
  <!--     <Dialog.Header> -->
  <!--       <Dialog.Title>Are you sure absolutely sure?</Dialog.Title> -->
  <!--       <Dialog.Description> -->
  <!--         This action cannot be undone. This will permanently delete your -->
  <!--         account and remove your data from our servers. -->
  <!--       </Dialog.Description> -->
  <!--     </Dialog.Header> -->
  <!--   </Dialog.Content> -->
  <!-- </Dialog.Root> -->
  <!---->
  <!-- <Card.Root class=""> -->
  <!--   <Card.Header> -->
  <!--     <Card.Title>Login to your account</Card.Title> -->
  <!--     <Card.Description -->
  <!--       >Enter your email below to login to your account</Card.Description -->
  <!--     > -->
  <!--     <Card.Action> -->
  <!--       <Button variant="link">Sign Up</Button> -->
  <!--     </Card.Action> -->
  <!--   </Card.Header> -->
  <!--   <Card.Content>Some Content</Card.Content> -->
  <!--   <Card.Footer class="flex-col gap-2">Some footer</Card.Footer> -->
  <!-- </Card.Root> -->
</div>
