<script lang="ts">
  import Healthcare from "./Healthcare.svelte";
  import Food from "./Food.svelte";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  let activities = [
    {
      time: 60,
      name: "Gym",
    },
    {
      time: 0, // Zero means that time is decided on the spot or it is until task completion
      name: "Kinetic App",
    },
    {
      time: 90,
      name: "Stretch & Talk",
    },
    {
      time: 0,
      name: "Home-Draw Laboratory Department",
    },
    {
      time: 0,
      name: "Clinic Crowdfunding Strategy",
    },
    {
      time: 0,
      name: "Crowd Interaction App",
    },
  ];

  let something = $state("Hristos");
</script>

<Login />
