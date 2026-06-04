<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  import CompassIcon from "@tabler/icons-svelte/icons/compass";
  import LogoutIcon from "@tabler/icons-svelte/icons/logout";
  import UserIcon from "@tabler/icons-svelte/icons/user";
  import HeartRateMonitorIcon from "@tabler/icons-svelte/icons/heart-rate-monitor";
  import BusinessPlanIcon from "@tabler/icons-svelte/icons/businessplan";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  interface AppConfig {
    id: string;
    name: string;
    icon: any;
    href: string;
    description: string;
  }

  interface UserMetadata {
    user_id: string;
    email: string;
  }

  const apps: AppConfig[] = [
    {
      id: "health",
      name: "Health",
      icon: HeartRateMonitorIcon,
      href: "/health",
      description: "Labs and Body monitoring",
    },
    // {
    //   id: "business",
    //   name: "Business",
    //   icon: BusinessPlanIcon,
    //   href: "/business",
    //   description:
    //     "Calculations and Plans for starting and operating a business",
    // },
    // {
    //   id: "meridian",
    //   name: "Meridian",
    //   icon: CompassIcon,
    //   href: "/meridian",
    //   description: "Planning & Ideas",
    // },
  ];

  // 1. Safe reactive extraction of local storage metadata
  let userData = $state<UserMetadata | null>(null);

  if (browser) {
    const stored = localStorage.getItem("monada_user");
    if (stored) {
      try {
        userData = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }

  // 3. Graceful fallback logic for currentApp initialization
  function getInitialApp(): AppConfig {
    const cachedHref = browser ? localStorage.getItem("currentApp") : null;
    const matched = apps.find((a) => a.href === cachedHref);

    // Fallback to the first unlocked app if they lack access to the cached one
    if (matched) {
      return matched;
    }
    return apps[0];
  }

  let currentApp = $state<AppConfig>(getInitialApp());

  async function logout() {
    await fetch(`/api/auth/logout`, { method: "POST", credentials: "include" });
    if (browser) {
      localStorage.removeItem("monada_user");
      localStorage.removeItem("currentApp");
    }
    location.reload();
  }
</script>

<Menubar.Root class="bg-background h-auto shadow-lg">
  <Menubar.Menu>
    <Menubar.Trigger class="h-auto px-2 py-1">
      {@const Icon = currentApp.icon}
      <Icon class="size-6 text-primary" />
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
            <div class="flex flex-col text-left">
              <span>
                {app.name}
              </span>
            </div>
          </Menubar.RadioItem>
        {/each}
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>

  <Separator orientation="vertical" class="h-6 mx-1" />

  <Menubar.Menu>
    <Menubar.Trigger class="h-auto px-2 py-1 ml-auto">
      <UserIcon class="size-6 " />
    </Menubar.Trigger>
    <Menubar.Content>
      <div
        class="px-2 py-1.5 text-xs text-muted-foreground font-mono truncate max-w-[200px]"
      >
        {userData?.email ?? "Not logged in"}
      </div>
      <Separator class="my-1" />
      <Menubar.Item
        onclick={logout}
        class="text-destructive focus:bg-destructive/10 focus:text-destructive"
      >
        <LogoutIcon class="size-4 mr-2" />
        Logout
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
