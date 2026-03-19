<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import SectionCards from "$lib/components/section-cards.svelte";
  import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
  import DataTable from "$lib/components/data-table.svelte";

  let data = [
    {
      id: 1,
      header: "Cover page",
      type: "Cover page",
      status: "In Process",
      target: "18",
      limit: "5",
      reviewer: "Eddie Lake",
    },
    {
      id: 2,
      header: "Table of contents",
      type: "Table of contents",
      status: "Done",
      target: "29",
      limit: "24",
      reviewer: "Eddie Lake",
    },
  ];
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <AppSidebar variant="inset" />
  <Sidebar.Inset>
    <SiteHeader />
    <div class="flex flex-1 flex-col">
      <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div class="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable {data} />
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
