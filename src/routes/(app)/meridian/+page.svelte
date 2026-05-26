<script lang="ts">
  import { fly } from "svelte/transition";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
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

  function top10PriortyThings() {

  }
  let top10PriorityThings = [];
</script>

<Card.Root class="w-full">
  <Card.Header>
    <Card.Title>Login to your account</Card.Title>
    <Card.Description
      >Enter your email below to login to your account</Card.Description
    >
    <Card.Action>
      <Button variant="link">Sign Up</Button>
    </Card.Action>
  </Card.Header>
  <Card.Content class="flex flex-row gap-2 overflow-hidden">
    <h1>Hey</h1>
  </Card.Content>
  <Card.Footer class="flex-col gap-2">
    <Button type="submit" class="w-full">Login</Button>
    <Button variant="outline" class="w-full">Login with Google</Button>
  </Card.Footer>
</Card.Root>

<!-- <Meridian /> -->
