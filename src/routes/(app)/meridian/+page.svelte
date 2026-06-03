<script lang="ts">
  import { fly } from "svelte/transition";
  import { Badge } from "$lib/components/ui/badge";
  import { ArrowUpIcon, Delete, X } from "@lucide/svelte/icons";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { post } from "$lib/utils";
  import { onMount } from "svelte";

  post("meridian/top_tasks", {
    whatever: "something",
  });

  // import Meridian from "./meridian.svelte";

  let goals;
  let projects;
  let tasks;

  onMount(async () => {
    goals = await post("/meridian/goals");
    projects = await post("/meridian/projects");
    tasks = await post("/meridian/tasks");
  });

  function top10PriortyThings() {}
  let top10PriorityThings = [];
</script>

<div class="flex flex-col gap-6">
  <Input type="text" placeholder="Name" class="" />
  <Input type="number" placeholder="Price" class="" />

  <Dialog.Root>
    <Dialog.Trigger
      type="button"
      class={buttonVariants({ variant: "outline" })}
    >
      Open Dialog
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>

  <Card.Root class="">
    <Card.Header>
      <Card.Title>Login to your account</Card.Title>
      <Card.Description
        >Enter your email below to login to your account</Card.Description
      >
      <Card.Action>
        <Button variant="link">Sign Up</Button>
      </Card.Action>
    </Card.Header>
    <Card.Content>Some Content</Card.Content>
    <Card.Footer class="flex-col gap-2">Some footer</Card.Footer>
  </Card.Root>
</div>
