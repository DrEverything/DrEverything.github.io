<script lang="ts">
  import { post } from "$lib/utils";
  import LabPanel from "./LabPanel.svelte";

  post("health/profile", {
    whatever: "something",
  });
</script>



<!-- <LabPanel /> -->
