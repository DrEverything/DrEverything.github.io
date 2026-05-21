<script lang="ts">
  import { fly } from "svelte/transition";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { post } from "$lib/utils";

  post("meridian/top_tasks", {
    whatever: "something",
  });

  // import Meridian from "./meridian.svelte";

  console.log("meridian");

  let top_ten_next_tasks_for_user = [];
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
