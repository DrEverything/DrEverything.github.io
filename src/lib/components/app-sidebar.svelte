<script lang="ts">
  // import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
  import NavMain from "./nav-main.svelte";
  import NavSecondary from "./nav-secondary.svelte";
  import NavUser from "./nav-user.svelte";
  import AppSwitcher from "./app-switcher.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import type { ComponentProps } from "svelte";
  import type { Component } from "svelte";
  // import { goto } from "$app/navigation";

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

  // let currentIndex = $state(0);
  // let currentApp = $derived(apps[currentIndex]);
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
  <Sidebar.Header>
    <AppSwitcher {apps} />
  </Sidebar.Header>

  <Sidebar.Content>
    <NavMain items={navMain} />
    <NavSecondary items={navSecondary} class="mt-auto" />
  </Sidebar.Content>

  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
</Sidebar.Root>
