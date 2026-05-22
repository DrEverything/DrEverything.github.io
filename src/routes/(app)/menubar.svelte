<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  import CompassIcon from "@tabler/icons-svelte/icons/compass";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserIcon from "@tabler/icons-svelte/icons/user";
  import DashboardIcon from "@tabler/icons-svelte/icons/dashboard";
  import HeartRateMonitorIcon from "@tabler/icons-svelte/icons/heart-rate-monitor";
  import BusinessPlanIcon from "@tabler/icons-svelte/icons/businessplan";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  const apps: any[] = [
    {
      name: "Health",
      icon: HeartRateMonitorIcon,
      href: "/health",
      description: "Labs and Body monitoring",
    },
    {
      name: "Business",
      icon: BusinessPlanIcon,
      href: "/business",
      description:
        "Calculations and Plans for starting and operating a business",
    },
    {
      name: "Meridian",
      icon: CompassIcon,
      href: "/meridian",
      description: "Planning & Ideas",
    },
    // {
    //   name: "Dashboard",
    //   icon: DashboardIcon,
    //   href: "/",
    //   description: "dashboard",
    // },
  ];

  const user = {
    name: "myName",
    icon: UserIcon,
  };

  let currentApp = $state(
    apps.find(
      (a) => a.href === (browser ? localStorage.getItem("currentApp") : null),
    ) ?? apps[0],
  );

  async function logout() {
    await fetch(`/api/auth/logout`, { method: "POST", credentials: "include" });
    location.reload();
  }
</script>

<Menubar.Root class="bg-background h-auto shadow-lg">
  <Menubar.Menu>
    <Menubar.Trigger class="h-auto px-2 py-1">
      {@const Icon = currentApp.icon}
      <Icon class="size-6" />
    </Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup value={currentApp.name}>
        {#each apps as app}
          <Menubar.RadioItem
            class="cursor-default"
            value={app.name}
            onSelect={() => {
              currentApp = app;

              localStorage.setItem("currentApp", app.href);

              goto(app.href);
            }}
          >
            {@const Icon = app.icon}
            <Icon class="mr-2 size-4" />
            {app.name}
          </Menubar.RadioItem>
        {/each}
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>

  <Separator orientation="vertical" class="h-6 mx-1" />

  <Separator orientation="vertical" class="h-6 mx-1" />

  <Menubar.Menu>
    <Menubar.Trigger class="h-auto px-2 py-1">
      {@const Icon = user.icon}
      <Icon class="size-6" />
    </Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item onclick={logout}>
        <LogoutIcon class="size-4" />
        Logout</Menubar.Item
      >
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
