<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import SectionCards from "$lib/components/section-cards.svelte";
  import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  // import { LayoutGrid } from "$lib/components/icons/LayoutGrid.svelte";
  import LayoutGrid from "@tabler/icons-svelte/icons/grid-dots";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";

  const apps = [
    { name: "Fitness", icon: "🏋️", href: "/fitness" },
    { name: "Tasks", icon: "🏋️", href: "/tasks" },
    // { name: "Social", icon: "💬", href: "/social" },
    // { name: "Video", icon: "🎬", href: "/video" },
    // { name: "Taxes", icon: "🧾", href: "/taxes" },
    // { name: "Banking", icon: "🏦", href: "/banking" },
    // { name: "Travel", icon: "✈️", href: "/travel" },
    // { name: "Jobs", icon: "💼", href: "/jobs" },
    // { name: "Automation", icon: "⚙️", href: "/automation" },
    // { name: "AI", icon: "🤖", href: "/ai" },
  ];

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

          <Popover.Root>
            <Popover.Trigger
              class={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <LayoutGrid class="h-5 w-5" />
            </Popover.Trigger>

            <Popover.Content class="w-72 p-3" align="end">
              <div class="grid grid-cols-3 gap-1">
                {#each apps as app}
                  <a
                    href={app.href}
                    class="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center
                 hover:bg-accent transition-colors"
                  >
                    <span class="text-2xl">{app.icon}</span>
                    <span class="text-xs text-muted-foreground">{app.name}</span
                    >
                  </a>
                {/each}
              </div>
            </Popover.Content>
          </Popover.Root>

          {#each data as items}
            <Dialog.Root>
              <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
                >Share</Dialog.Trigger
              >
              <Dialog.Content class="sm:max-w-md">
                <Dialog.Header>
                  <Dialog.Title>Share link</Dialog.Title>
                  <Dialog.Description>
                    Anyone who has this link will be able to view this.
                  </Dialog.Description>
                </Dialog.Header>
                <div class="flex items-center gap-2">
                  <div class="grid flex-1 gap-2">
                    <Label for="link" class="sr-only">Link</Label>
                    <Input
                      id="link"
                      defaultValue="https://shadcn-svelte.com/docs/installation"
                    />
                  </div>
                </div>
                <Dialog.Footer class="sm:justify-start">
                  <Dialog.Close class={buttonVariants({ variant: "secondary" })}
                    >Close</Dialog.Close
                  >
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          {/each}

          <!-- <DataTable {data} /> -->
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
