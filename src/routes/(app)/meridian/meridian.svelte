<script lang="ts">
  import { Target, FolderKanban, CheckSquare, Plus, Trash2, Link, Unlink } from '@lucide/svelte/icons';

  type NodeType = 'goal' | 'project' | 'task';

  interface Node {
    id: string;
    label: string;
    type: NodeType;
    status: 'todo' | 'in-progress' | 'done';
    parentIds: string[]; // Node IDs this node connects to (e.g., Project -> Goals)
  }

  // Reactive state (Svelte 5 Runes)
  let nodes = $state<Node[]>([
    { id: 'g1', label: 'Launch Monada', type: 'goal', status: 'in-progress', parentIds: [] },
    { id: 'p1', label: 'Build Meridian Interface', type: 'project', status: 'in-progress', parentIds: ['g1'] },
    { id: 't1', label: 'Design interactive Svelte graph component', type: 'task', status: 'todo', parentIds: ['p1'] },
    { id: 't2', label: 'Clean the workspace', type: 'task', status: 'todo', parentIds: [] } // Orphan Task
  ]);

  let newLabel = $state('');
  let newType = $state<NodeType>('task');
  let selectedParents = $state<string[]>([]);

  // Computed helper to find children of a given node
  function getChildren(nodeId: string): Node[] {
    return nodes.filter(n => n.parentIds.includes(nodeId));
  }

  // Get nodes that have no parents of a specific parent-type hierarchy
  // e.g. Projects with no Goals, or Tasks with no Projects
  const orphanProjects = $derived(
    nodes.filter(n => n.type === 'project' && n.parentIds.length === 0)
  );

  const orphanTasks = $derived(
    nodes.filter(n => n.type === 'task' && !nodes.some(p => p.type === 'project' && n.parentIds.includes(p.id)))
  );

  const goals = $derived(nodes.filter(n => n.type === 'goal'));

  function addNode() {
    if (!newLabel.trim()) return;

    const id = Math.random().toString(36).substring(2, 9);
    nodes.push({
      id,
      label: newLabel,
      type: newType,
      status: 'todo',
      parentIds: [...selectedParents]
    });

    // Reset inputs
    newLabel = '';
    selectedParents = [];
  }

  function deleteNode(id: string) {
    // Remove the node
    nodes = nodes.filter(n => n.id !== id);
    // Remove linkages pointing to this deleted node
    nodes = nodes.map(n => ({
      ...n,
      parentIds: n.parentIds.filter(pid => pid !== id)
    }));
  }

  function toggleStatus(id: string) {
    nodes = nodes.map(n => {
      if (n.id === id) {
        const nextStatus: Record<Node['status'], Node['status']> = {
          'todo': 'in-progress',
          'in-progress': 'done',
          'done': 'todo'
        };
        return { ...n, status: nextStatus[n.status] };
      }
      return n;
    });
  }

  // Helper lists for the parent-selector field
  const potentialParents = $derived(
    newType === 'task' 
      ? nodes.filter(n => n.type === 'project')
      : newType === 'project' 
        ? nodes.filter(n => n.type === 'goal')
        : []
  );
</script>

<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
  
  <!-- Config/Creation Panel -->
  <div class="lg:col-span-1 bg-card border border-border rounded-xl p-5 space-y-5 h-fit">
    <h3 class="text-lg font-semibold tracking-tight">Add Node</h3>
    
    <div class="space-y-4">
      <!-- Type Selection -->
      <div>
        <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5" for="type-select">Type</label>
        <div class="grid grid-cols-3 gap-2 bg-muted p-1 rounded-lg">
          {#each ['goal', 'project', 'task'] as type}
            <button
              id="type-select"
              class="capitalize py-1 text-sm font-medium rounded transition-all {newType === type ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
              onclick={() => { newType = type as NodeType; selectedParents = []; }}
            >
              {type}
            </button>
          {/each}
        </div>
      </div>

      <!-- Label -->
      <div>
        <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5" for="node-name">Name</label>
        <input
          id="node-name"
          type="text"
          bind:value={newLabel}
          placeholder="Clean the house, launch app..."
          class="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <!-- Optional Parent Association (to avoid orphans if desired) -->
      {#if potentialParents.length > 0}
        <div>
          <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5" for="parent-select">
            Link to {newType === 'task' ? 'Project' : 'Goal'} (Optional)
          </label>
          <select
            id="parent-select"
            multiple
            bind:value={selectedParents}
            class="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px]"
          >
            {#each potentialParents as parent}
              <option value={parent.id}>{parent.label}</option>
            {/each}
          </select>
          <span class="text-[11px] text-muted-foreground mt-1 block">Hold Ctrl/Cmd to select multiple. Leave unselected to keep orphan.</span>
        </div>
      {/if}

      <button
        onclick={addNode}
        class="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus class="w-4 h-4" /> Add to Graph
      </button>
    </div>
  </div>

  <!-- Graph Tree/Hierarchy Display -->
  <div class="lg:col-span-3 space-y-8">
    
    <!-- 1. Hierarchical Graph: Goals -> Projects -> Tasks -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold tracking-tight">Structured Graph</h2>
      
      {#if goals.length === 0 && orphanProjects.length === 0 && orphanTasks.length === 0}
        <div class="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
          No nodes mapped out. Add some components on the left panel to populate your graph.
        </div>
      {/if}

      {#each goals as goal (goal.id)}
        <div class="border border-border rounded-xl bg-card p-4 space-y-4 shadow-sm">
          <!-- Goal Row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Target class="w-5 h-5" />
              </span>
              <div>
                <h4 class="font-semibold text-base">{goal.label}</h4>
                <span class="text-xs text-muted-foreground uppercase tracking-wider">Goal</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button 
                onclick={() => toggleStatus(goal.id)} 
                class="text-xs px-2.5 py-1 rounded-full border border-border bg-muted font-medium capitalize"
              >
                {goal.status}
              </button>
              <button 
                onclick={() => deleteNode(goal.id)} 
                aria-label="Delete Goal"
                class="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Connected Projects -->
          <div class="pl-6 border-l border-border space-y-3">
            {#each getChildren(goal.id) as project (project.id)}
              <div class="border border-border/80 bg-background rounded-lg p-3 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="p-1.5 bg-blue-500/10 text-blue-500 rounded-md">
                      <FolderKanban class="w-4 h-4" />
                    </span>
                    <h5 class="font-medium text-sm">{project.label}</h5>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      onclick={() => toggleStatus(project.id)} 
                      class="text-[11px] px-2 py-0.5 rounded-full border border-border bg-muted font-medium capitalize"
                    >
                      {project.status}
                    </button>
                    <button 
                      onclick={() => deleteNode(project.id)} 
                      aria-label="Delete Project"
                      class="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Connected Tasks inside Project -->
                <div class="pl-5 border-l border-border/60 space-y-2">
                  {#each getChildren(project.id) as task (task.id)}
                    <div class="flex items-center justify-between bg-muted/50 border border-border/40 p-2 rounded-md">
                      <div class="flex items-center gap-2">
                        <CheckSquare class="w-4 h-4 text-purple-500" />
                        <span class="text-xs {task.status === 'done' ? 'line-through text-muted-foreground' : ''}">{task.label}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button 
                          onclick={() => toggleStatus(task.id)} 
                          class="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/80 font-medium capitalize"
                        >
                          {task.status}
                        </button>
                        <button 
                          onclick={() => deleteNode(task.id)} 
                          aria-label="Delete Task"
                          class="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- 2. Orphans Section -->
    {#if orphanProjects.length > 0 || orphanTasks.length > 0}
      <div class="border border-border bg-card/40 rounded-xl p-5 space-y-4">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Unlink class="w-4 h-4 text-yellow-500" />
          <h3 class="text-sm font-semibold tracking-wider uppercase">Orphans (No parent relationships)</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Orphan Projects -->
          {#if orphanProjects.length > 0}
            <div class="space-y-2">
              <span class="text-xs font-semibold text-muted-foreground block">Projects without Goals</span>
              <div class="space-y-2">
                {#each orphanProjects as project (project.id)}
                  <div class="border border-border bg-background p-3 rounded-lg space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-2 text-sm font-medium">
                        <FolderKanban class="w-4 h-4 text-blue-500" />
                        {project.label}
                      </span>
                      <button onclick={() => deleteNode(project.id)} aria-label="Delete Project" class="text-muted-foreground hover:text-destructive">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <!-- Linked tasks under orphan project -->
                    <div class="pl-4 border-l border-border/80 space-y-1.5">
                      {#each getChildren(project.id) as task (task.id)}
                        <div class="flex items-center justify-between text-xs bg-muted/30 p-1.5 rounded border border-border/30">
                          <span>{task.label}</span>
                          <button onclick={() => deleteNode(task.id)} aria-label="Delete Task" class="text-muted-foreground hover:text-destructive">
                            <Trash2 class="w-3 h-3" />
                          </button>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Orphan Tasks -->
          {#if orphanTasks.length > 0}
            <div class="space-y-2">
              <span class="text-xs font-semibold text-muted-foreground block">Tasks without Projects</span>
              <div class="space-y-2">
                {#each orphanTasks as task (task.id)}
                  <div class="flex items-center justify-between border border-border bg-background p-3 rounded-lg text-sm">
                    <span class="flex items-center gap-2">
                      <CheckSquare class="w-4 h-4 text-purple-500" />
                      <span class={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>{task.label}</span>
                    </span>
                    <div class="flex items-center gap-2">
                      <button 
                        onclick={() => toggleStatus(task.id)} 
                        class="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted font-medium capitalize"
                      >
                        {task.status}
                      </button>
                      <button onclick={() => deleteNode(task.id)} aria-label="Delete Task" class="text-muted-foreground hover:text-destructive">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

  </div>
</div>
