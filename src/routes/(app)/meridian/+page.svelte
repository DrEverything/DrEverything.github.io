<script lang="ts">
  import { onMount } from "svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Badge from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { toast } from "svelte-sonner";
  import IconPlus from "@tabler/icons-svelte/icons/plus";
  import IconTrash from "@tabler/icons-svelte/icons/trash";
  import IconEdit from "@tabler/icons-svelte/icons/edit";
  import IconFolder from "@tabler/icons-svelte/icons/folder";
  import IconCheck from "@tabler/icons-svelte/icons/check";
  import IconBulb from "@tabler/icons-svelte/icons/bulb";
  import IconChevronRight from "@tabler/icons-svelte/icons/chevron-right";
  import IconX from "@tabler/icons-svelte/icons/x";
  import IconClock from "@tabler/icons-svelte/icons/clock";
  import IconListCheck from "@tabler/icons-svelte/icons/list-check";
  // import Markdown from "./markdown.svelte";

  // ── Types ────────────────────────────────────────────────────────────────────

  type Project = {
    project_id: string;
    name: string;
    description: string;
    status: string;
    created_at: number;
  };

  type Task = {
    task_id: string;
    project_id: string;
    name: string;
    description: string;
    status: string;
    due_at: number;
    created_at: number;
  };

  type Idea = {
    idea_id: string;
    name: string;
    description: string;
    created_at: number;
  };

  // ── State ────────────────────────────────────────────────────────────────────

  let activeTab = $state("projects");
  let loading = $state(true);

  // Projects
  let projects = $state<Project[]>([]);
  let selectedProject = $state<Project | null>(null);
  let projectDialog = $state(false);
  let editingProject = $state<Project | null>(null);
  let projectForm = $state({ name: "", description: "", status: "active" });

  // Tasks
  let tasks = $state<Task[]>([]);
  let tasksLoading = $state(false);
  let taskDialog = $state(false);
  let editingTask = $state<Task | null>(null);
  let taskForm = $state({
    name: "",
    description: "",
    status: "todo",
    due_at: "",
    project_id: "",
  });

  // Ideas
  let ideas = $state<Idea[]>([]);
  let ideaDialog = $state(false);
  let editingIdea = $state<Idea | null>(null);
  let ideaForm = $state({ name: "", description: "" });

  // ── API helpers ───────────────────────────────────────────────────────────────

  async function api(path: string, body: unknown = {}) {
    const res = await fetch(`/api/data${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // ── Projects ──────────────────────────────────────────────────────────────────

  async function loadProjects() {
    loading = true;
    try {
      projects = await api("/projects/list");
    } catch {
      toast.error("Failed to load projects");
    } finally {
      loading = false;
    }
  }

  function openAddProject() {
    editingProject = null;
    projectForm = { name: "", description: "", status: "active" };
    projectDialog = true;
  }

  function openEditProject(p: Project) {
    editingProject = p;
    projectForm = {
      name: p.name,
      description: p.description,
      status: p.status,
    };
    projectDialog = true;
  }

  async function saveProject() {
    try {
      if (editingProject) {
        await api("/projects/update", {
          project_id: editingProject.project_id,
          ...projectForm,
        });
        toast.success("Project updated");
      } else {
        await api("/projects/add", projectForm);
        toast.success("Project created");
      }
      projectDialog = false;
      await loadProjects();
    } catch {
      toast.error("Failed to save project");
    }
  }

  async function deleteProject(id: string) {
    try {
      await api("/projects/delete", { project_id: id });
      if (selectedProject?.project_id === id) {
        selectedProject = null;
        tasks = [];
      }
      toast.success("Project deleted");
      await loadProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  }

  async function selectProject(p: Project) {
    selectedProject = p;
    await loadTasks(p.project_id);
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────────

  async function loadTasks(projectId: string) {
    tasksLoading = true;
    try {
      tasks = await api("/tasks/list", { project_id: projectId });
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      tasksLoading = false;
    }
  }

  function openAddTask() {
    editingTask = null;
    taskForm = {
      name: "",
      description: "",
      status: "todo",
      due_at: "",
      project_id: selectedProject?.project_id ?? "",
    };
    taskDialog = true;
  }

  function openEditTask(t: Task) {
    editingTask = t;
    const d = t.due_at
      ? new Date(t.due_at * 1000).toISOString().slice(0, 10)
      : "";
    taskForm = {
      name: t.name,
      description: t.description,
      status: t.status,
      due_at: d,
      project_id: t.project_id,
    };
    taskDialog = true;
  }

  async function saveTask() {
    try {
      const payload = {
        ...taskForm,
        due_at: taskForm.due_at
          ? Math.floor(new Date(taskForm.due_at).getTime() / 1000)
          : 0,
        project_id: selectedProject!.project_id,
      };
      if (editingTask) {
        await api("/tasks/update", {
          task_id: editingTask.task_id,
          ...payload,
        });
        toast.success("Task updated");
      } else {
        await api("/tasks/add", payload);
        toast.success("Task added");
      }
      taskDialog = false;
      await loadTasks(selectedProject!.project_id);
    } catch {
      toast.error("Failed to save task");
    }
  }

  async function deleteTask(t: Task) {
    try {
      await api("/tasks/delete", { task_id: t.task_id });
      toast.success("Task deleted");
      await loadTasks(t.project_id);
    } catch {
      toast.error("Failed to delete task");
    }
  }

  // ── Ideas ─────────────────────────────────────────────────────────────────────

  async function loadIdeas() {
    try {
      ideas = await api("/ideas/list");
    } catch {
      toast.error("Failed to load ideas");
    }
  }

  function openAddIdea() {
    editingIdea = null;
    ideaForm = { name: "", description: "" };
    ideaDialog = true;
  }

  function openEditIdea(i: Idea) {
    editingIdea = i;
    ideaForm = { name: i.name, description: i.description };
    ideaDialog = true;
  }

  async function saveIdea() {
    try {
      if (editingIdea) {
        await api("/ideas/update", {
          idea_id: editingIdea.idea_id,
          ...ideaForm,
        });
        toast.success("Idea updated");
      } else {
        await api("/ideas/add", ideaForm);
        toast.success("Idea captured");
      }
      ideaDialog = false;
      await loadIdeas();
    } catch {
      toast.error("Failed to save idea");
    }
  }

  async function deleteIdea(id: string) {
    try {
      await api("/ideas/delete", { idea_id: id });
      toast.success("Idea deleted");
      await loadIdeas();
    } catch {
      toast.error("Failed to delete idea");
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function statusColor(status: string) {
    return (
      {
        active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
        completed: "bg-sky-500/15 text-sky-600 border-sky-500/20",
        paused: "bg-amber-500/15 text-amber-600 border-amber-500/20",
        todo: "bg-slate-500/15 text-slate-600 border-slate-500/20",
        "in-progress": "bg-violet-500/15 text-violet-600 border-violet-500/20",
        done: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
        archived: "bg-rose-500/15 text-rose-600 border-rose-500/20",
      }[status] ?? "bg-slate-500/15 text-slate-500 border-slate-500/20"
    );
  }

  function fmtDate(ts: number) {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function handleTabChange(tab: string) {
    activeTab = tab;
    if (tab === "ideas") loadIdeas();
  }

  onMount(loadProjects);
</script>

<!-- <Markdown -->
<!--   src={` -->
<!-- # Hello -->
<!---->
<!-- Inline math: $E = mc^2$ -->
<!---->
<!-- Block math: -->
<!-- $$ -->
<!-- \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2} -->
<!-- $$ -->
<!-- `} -->
<!-- /> -->

<!-- ── Project Dialog ───────────────────────────────────────────────────────── -->
<Dialog.Root bind:open={projectDialog}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title
        >{editingProject ? "Edit Project" : "New Project"}</Dialog.Title
      >
      <Dialog.Description>
        {editingProject
          ? "Update project details."
          : "Start a new project to organise your work."}
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col gap-4 py-2">
      <div class="flex flex-col gap-1.5">
        <Label for="p-name">Name</Label>
        <Input
          id="p-name"
          placeholder="Project name"
          bind:value={projectForm.name}
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="p-desc">Description</Label>
        <Textarea
          id="p-desc"
          placeholder="What's this project about?"
          bind:value={projectForm.description}
          rows={3}
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="p-status">Status</Label>
        <select
          id="p-status"
          bind:value={projectForm.status}
          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (projectDialog = false)}
        >Cancel</Button
      >
      <Button onclick={saveProject} disabled={!projectForm.name}>
        {editingProject ? "Save Changes" : "Create Project"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- ── Task Dialog ─────────────────────────────────────────────────────────── -->
<Dialog.Root bind:open={taskDialog}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingTask ? "Edit Task" : "New Task"}</Dialog.Title>
      <Dialog.Description>
        {editingTask
          ? "Update task details."
          : `Adding task to "${selectedProject?.name}".`}
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col gap-4 py-2">
      <div class="flex flex-col gap-1.5">
        <Label for="t-name">Name</Label>
        <Input id="t-name" placeholder="Task name" bind:value={taskForm.name} />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="t-desc">Description</Label>
        <Textarea
          id="t-desc"
          placeholder="Details…"
          bind:value={taskForm.description}
          rows={3}
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1.5">
          <Label for="t-status">Status</Label>
          <select
            id="t-status"
            bind:value={taskForm.status}
            class="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="t-due">Due Date</Label>
          <Input id="t-due" type="date" bind:value={taskForm.due_at} />
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (taskDialog = false)}
        >Cancel</Button
      >
      <Button onclick={saveTask} disabled={!taskForm.name}>
        {editingTask ? "Save Changes" : "Add Task"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- ── Idea Dialog ─────────────────────────────────────────────────────────── -->
<Dialog.Root bind:open={ideaDialog}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingIdea ? "Edit Idea" : "Capture Idea"}</Dialog.Title>
      <Dialog.Description>
        {editingIdea
          ? "Refine your idea."
          : "Jot down a thought before it slips away."}
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col gap-4 py-2">
      <div class="flex flex-col gap-1.5">
        <Label for="i-name">Title</Label>
        <Input
          id="i-name"
          placeholder="Idea title"
          bind:value={ideaForm.name}
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="i-desc">Notes</Label>
        <Textarea
          id="i-desc"
          placeholder="Describe the idea…"
          bind:value={ideaForm.description}
          rows={4}
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (ideaDialog = false)}
        >Cancel</Button
      >
      <Button onclick={saveIdea} disabled={!ideaForm.name}>
        {editingIdea ? "Save Changes" : "Capture"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- ── Main Page ───────────────────────────────────────────────────────────── -->
<div class="px-4 lg:px-6">
  <!-- Header -->
  <div class="mb-6 flex items-end justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Workspace</h1>
      <p class="text-muted-foreground mt-0.5 text-sm">
        Manage your projects, tasks, and ideas in one place.
      </p>
    </div>
  </div>

  <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
    <Tabs.List class="mb-6">
      <Tabs.Trigger value="projects">
        <IconFolder class="mr-1.5 size-4" />
        Projects
      </Tabs.Trigger>
      <Tabs.Trigger value="tasks" disabled={!selectedProject}>
        <IconListCheck class="mr-1.5 size-4" />
        Tasks {selectedProject ? `· ${selectedProject.name}` : ""}
      </Tabs.Trigger>
      <Tabs.Trigger value="ideas">
        <IconBulb class="mr-1.5 size-4" />
        Ideas
      </Tabs.Trigger>
    </Tabs.List>

    <!-- ── Projects Tab ───────────────────────────────────────────────────── -->
    <Tabs.Content value="projects">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-muted-foreground text-sm">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onclick={openAddProject}>
          <IconPlus class="mr-1.5 size-4" />
          New Project
        </Button>
      </div>

      {#if loading}
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each [1, 2, 3] as _}
            <Skeleton class="h-36 rounded-xl" />
          {/each}
        </div>
      {:else if projects.length === 0}
        <div
          class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
          <IconFolder class="text-muted-foreground mb-3 size-10 opacity-40" />
          <p class="font-medium">No projects yet</p>
          <p class="text-muted-foreground mt-1 text-sm">
            Create a project to get started.
          </p>
          <Button class="mt-4" size="sm" onclick={openAddProject}>
            <IconPlus class="mr-1.5 size-4" />
            New Project
          </Button>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each projects as project (project.project_id)}
            <Card.Root
              class="group relative cursor-pointer transition-shadow hover:shadow-md {selectedProject?.project_id ===
              project.project_id
                ? 'ring-primary ring-2'
                : ''}"
              onclick={() => {
                selectProject(project);
                activeTab = "tasks";
              }}
            >
              <Card.Header class="pb-2">
                <div class="flex items-start justify-between gap-2">
                  <Card.Title class="text-base leading-snug"
                    >{project.name}</Card.Title
                  >
                  <span
                    class="border text-xs font-medium px-2 py-0.5 rounded-full {statusColor(
                      project.status,
                    )} whitespace-nowrap"
                  >
                    {project.status}
                  </span>
                </div>
              </Card.Header>
              <Card.Content class="pb-3">
                <p class="text-muted-foreground line-clamp-2 text-sm">
                  {project.description || "No description."}
                </p>
              </Card.Content>
              <Card.Footer class="flex items-center justify-between pt-0">
                <span class="text-muted-foreground text-xs"
                  >{fmtDate(project.created_at)}</span
                >
                <div
                  class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                  onclick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-7"
                    onclick={() => openEditProject(project)}
                  >
                    <IconEdit class="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-7 text-destructive hover:text-destructive"
                    onclick={() => deleteProject(project.project_id)}
                  >
                    <IconTrash class="size-3.5" />
                  </Button>
                </div>
              </Card.Footer>
            </Card.Root>
          {/each}
        </div>
      {/if}
    </Tabs.Content>

    <!-- ── Tasks Tab ──────────────────────────────────────────────────────── -->
    <Tabs.Content value="tasks">
      {#if selectedProject}
        <div class="mb-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-2 min-w-0">
            <button
              class="text-muted-foreground hover:text-foreground text-sm transition-colors"
              onclick={() => (activeTab = "projects")}
            >
              Projects
            </button>
            <IconChevronRight class="text-muted-foreground size-3.5 shrink-0" />
            <span class="text-sm font-medium truncate"
              >{selectedProject.name}</span
            >
          </div>
          <Button size="sm" onclick={openAddTask}>
            <IconPlus class="mr-1.5 size-4" />
            Add Task
          </Button>
        </div>

        {#if tasksLoading}
          <div class="flex flex-col gap-2">
            {#each [1, 2, 3] as _}
              <Skeleton class="h-16 rounded-lg" />
            {/each}
          </div>
        {:else if tasks.length === 0}
          <div
            class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
          >
            <IconListCheck
              class="text-muted-foreground mb-3 size-10 opacity-40"
            />
            <p class="font-medium">No tasks yet</p>
            <p class="text-muted-foreground mt-1 text-sm">
              Add a task to start making progress.
            </p>
            <Button class="mt-4" size="sm" onclick={openAddTask}>
              <IconPlus class="mr-1.5 size-4" />
              Add Task
            </Button>
          </div>
        {:else}
          <div class="flex flex-col gap-2">
            {#each tasks as task (task.task_id)}
              <div
                class="border-border group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-shadow hover:shadow-sm"
              >
                <!-- Status dot -->
                <div
                  class="shrink-0 size-2 rounded-full {task.status === 'done'
                    ? 'bg-emerald-500'
                    : task.status === 'in-progress'
                      ? 'bg-violet-500'
                      : 'bg-slate-400'}"
                ></div>

                <div class="min-w-0 flex-1">
                  <p
                    class="text-sm font-medium leading-tight {task.status ===
                    'done'
                      ? 'line-through text-muted-foreground'
                      : ''}"
                  >
                    {task.name}
                  </p>
                  {#if task.description}
                    <p class="text-muted-foreground mt-0.5 truncate text-xs">
                      {task.description}
                    </p>
                  {/if}
                </div>

                <div class="flex shrink-0 items-center gap-3">
                  {#if task.due_at}
                    <span
                      class="text-muted-foreground flex items-center gap-1 text-xs"
                    >
                      <IconClock class="size-3" />
                      {fmtDate(task.due_at)}
                    </span>
                  {/if}
                  <span
                    class="border text-xs font-medium px-2 py-0.5 rounded-full {statusColor(
                      task.status,
                    )}"
                  >
                    {task.status}
                  </span>
                  <div
                    class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      class="size-7"
                      onclick={() => openEditTask(task)}
                    >
                      <IconEdit class="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="size-7 text-destructive hover:text-destructive"
                      onclick={() => deleteTask(task)}
                    >
                      <IconTrash class="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </Tabs.Content>

    <!-- ── Ideas Tab ──────────────────────────────────────────────────────── -->
    <Tabs.Content value="ideas">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-muted-foreground text-sm">
          {ideas.length} idea{ideas.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onclick={openAddIdea}>
          <IconPlus class="mr-1.5 size-4" />
          Capture Idea
        </Button>
      </div>

      {#if ideas.length === 0}
        <div
          class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
          <IconBulb class="text-muted-foreground mb-3 size-10 opacity-40" />
          <p class="font-medium">No ideas yet</p>
          <p class="text-muted-foreground mt-1 text-sm">
            Capture a thought before it slips away.
          </p>
          <Button class="mt-4" size="sm" onclick={openAddIdea}>
            <IconPlus class="mr-1.5 size-4" />
            Capture Idea
          </Button>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each ideas as idea (idea.idea_id)}
            <Card.Root class="group relative">
              <Card.Header class="pb-2">
                <div class="flex items-start justify-between gap-2">
                  <Card.Title class="text-base leading-snug"
                    >{idea.name}</Card.Title
                  >
                </div>
              </Card.Header>
              <Card.Content class="pb-3">
                <p class="text-muted-foreground line-clamp-3 text-sm">
                  {idea.description || "No notes."}
                </p>
              </Card.Content>
              <Card.Footer class="flex items-center justify-between pt-0">
                <span class="text-muted-foreground text-xs"
                  >{fmtDate(idea.created_at)}</span
                >
                <div
                  class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-7"
                    onclick={() => openEditIdea(idea)}
                  >
                    <IconEdit class="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-7 text-destructive hover:text-destructive"
                    onclick={() => deleteIdea(idea.idea_id)}
                  >
                    <IconTrash class="size-3.5" />
                  </Button>
                </div>
              </Card.Footer>
            </Card.Root>
          {/each}
        </div>
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>
