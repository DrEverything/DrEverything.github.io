<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import CompassIcon from "@tabler/icons-svelte/icons/compass";
  import BrainIcon from "@tabler/icons-svelte/icons/brain";
  import BuildingIcon from "@tabler/icons-svelte/icons/building";
  import PlaneIcon from "@tabler/icons-svelte/icons/plane";
  import ActivityIcon from "@tabler/icons-svelte/icons/activity";

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Spinner } from "$lib/components/ui/spinner";

  let { children } = $props();
  let status = $state<-1 | 0 | 1>(0);

  onMount(async () => {
    const res = await fetch("/api/auth/check", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      status = 1;
    } else {
      goto("/login");
    }
  });

  const apps: any[] = [
    { name: "Meridian", icon: CompassIcon, href: "/" },
    { name: "Fitness", icon: ActivityIcon, href: "/fitness" },
    // { name: "Finance", icon: BuildingIcon, href: "/finance" },
    // { name: "Travel", icon: PlaneIcon, href: "/travel" },
    // { name: "AI", icon: BrainIcon, href: "/ai" },
  ];

  let user = {
    name: "You",
    email: "you@example.com",
    avatar: "",
  };

  let navMain: any[] = [
    // { title: "Dashboard", url: "/",          icon: DashboardIcon },
    // { title: "Projects",  url: "/projects",  icon: FolderIcon },
    // { title: "Analytics", url: "/analytics", icon: ChartBarIcon },
  ];

  let navSecondary: any[] = [
    // { title: "Settings", url: "/settings", icon: SettingsIcon },
    // { title: "Help",     url: "/help",     icon: HelpIcon },
  ];
</script>

{#if status === 0}
  <div class="flex min-h-svh items-center justify-center">
    <Spinner class="size-8" />
  </div>
{:else}
  <Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 51); --header-height: calc(var(--spacing) * 10);"
  >
    <AppSidebar variant="inset" {apps} {user} {navMain} {navSecondary} />
    <Sidebar.Inset>
      <SiteHeader />
      <div class="flex flex-1 flex-col">
        <div class="@container/main flex flex-1 flex-col gap-2">
          <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {@render children()}
          </div>
        </div>
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
