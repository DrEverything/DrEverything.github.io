<script lang="ts">
  import CompassIcon from "@tabler/icons-svelte/icons/compass";
  import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
  import BrainIcon from "@tabler/icons-svelte/icons/brain";
  import BuildingIcon from "@tabler/icons-svelte/icons/building";
  import PlaneIcon from "@tabler/icons-svelte/icons/plane";
  import ActivityIcon from "@tabler/icons-svelte/icons/activity";

  import NavMain from "./nav-main.svelte";
  import NavSecondary from "./nav-secondary.svelte";
  import NavUser from "./nav-user.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import type { ComponentProps } from "svelte";

  // import type { App } from "../../routes/(app)/+layout.svelte";

  import type { Component } from "svelte";
  type App = {
    name: string;
    icon: Component;
    href: string;
  };

  type User = {
    name: string;
    email: string;
    avatar: string;
  };

  let {
    apps,
    user,
    navMain,
    navSecondary,
    ...restProps
  }: {
    apps: App[];
    user: User;
    navMain: any[];
    navSecondary: any[];
  } & ComponentProps<typeof Sidebar.Root> = $props();

  let currentIndex = $state(0);
  let currentApp = $derived(apps[currentIndex]);

  // const apps = [
  //   { name: "Meridian", icon: CompassIcon, href: "/" },
  //   { name: "Fitness", icon: ActivityIcon, href: "/fitness" },
  //   { name: "Finance", icon: BuildingIcon, href: "/finance" },
  //   { name: "Travel", icon: PlaneIcon, href: "/travel" },
  //   { name: "AI", icon: BrainIcon, href: "/ai" },
  // ];

  // const data = {
  //   user: {
  //     name: "You",
  //     email: "you@example.com",
  //     avatar: "",
  //   },
  //   navMain: [
  //     // { title: "Dashboard", url: "/",          icon: DashboardIcon },
  //     // { title: "Projects",  url: "/projects",  icon: FolderIcon },
  //     // { title: "Analytics", url: "/analytics", icon: ChartBarIcon },
  //   ],
  //   navSecondary: [
  //     // { title: "Settings", url: "/settings", icon: SettingsIcon },
  //     // { title: "Help",     url: "/help",     icon: HelpIcon },
  //   ],
  // };

  // let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
  // let {
  //   apps,
  //   ...restProps
  // }: { apps: typeof apps } & ComponentProps<typeof Sidebar.Root> = $props();
  //
  // let currentApp = $state(apps[0]);
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton
                {...props}
                class="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <currentApp.icon class="!size-5" />
                <span class="text-base font-semibold">{currentApp.name}</span>
                <ChevronDownIcon class="ms-auto size-4 opacity-50" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-48" align="start" sideOffset={4}>
            {#each apps as app, i}
              <DropdownMenu.Item onclick={() => (currentIndex = i)}>
                <app.icon class="size-4" />
                {app.name}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <Sidebar.Content>
    <NavMain items={navMain} />
    <NavSecondary items={navSecondary} class="mt-auto" />
  </Sidebar.Content>

  <Sidebar.Footer>
    <NavUser user={user} />
  </Sidebar.Footer>
</Sidebar.Root>
