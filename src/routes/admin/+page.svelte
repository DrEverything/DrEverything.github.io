<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { toast } from "$lib/components/ui/toast/index.js";
  
  import Play from "@lucide/svelte/icons/play";
  import Database from "@lucide/svelte/icons/database";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import TableProperties from "@lucide/svelte/icons/table-properties";
  import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Terminal from "@lucide/svelte/icons/terminal";
  import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
  import RefreshCw from "@lucide/svelte/icons/refresh-cw";
  import Layers from "@lucide/svelte/icons/layers";
  import CheckCircle from "@lucide/svelte/icons/check-circle";

  // State variables (Svelte 5 runes)
  let status = $state<-1 | 0 | 1>(0); // -1: Error/Redirect, 0: Checking Auth, 1: Authorized
  let email = $state("");
  let scope = $state<string[]>([]);
  
  let relations = $state<string[]>([]);
  let relationsLoading = $state(false);
  let selectedRelation = $state("");
  let selectedSchema = $state<{ headers: string[]; rows: any[][] } | null>(null);
  
  let queryText = $state("");
  let queryLoading = $state(false);
  let queryResult = $state<{ headers: string[]; rows: any[][] } | null>(null);
  let queryError = $state<string | null>(null);
  let activeTab = $state("table");

  // Query templates
  const templates = [
    { name: "List Relations", query: "::relations" },
    { name: "List Users", query: "?[email, user_id, created_at] := *user{email, user_id, created_at}" },
    { name: "List Passkeys", query: "?[cred_id, user_id, email] := *passkey{cred_id, user_id, email}" },
    { name: "List Projects", query: "?[project_id, user_id, name] := *project{project_id, user_id, name}" },
    { name: "List Tasks", query: "?[task_id, project_id, name] := *task{task_id, project_id, name}" },
    { name: "List Ideas", query: "?[idea_id, user_id, name] := *idea{idea_id, user_id, name}" },
  ];

  // Database value formatter helper to resolve Cozo enum wrapper objects
  function formatDataValue(val: any): string {
    if (val === null || val === undefined) return "null";
    if (typeof val === 'object') {
      if ('Str' in val) return val.Str;
      if ('Num' in val) {
        if ('Int' in val.Num) return val.Num.Int.toString();
        if ('Float' in val.Num) return val.Num.Float.toString();
      }
      if ('Bool' in val) return val.Bool ? "true" : "false";
      if ('Bytes' in val) {
        return `[Bytes: ${val.Bytes.length || 0} bytes]`;
      }
      if ('List' in val) {
        return `[${val.List.map(formatDataValue).join(", ")}]`;
      }
      if ('Null' in val) {
        return "null";
      }
      return JSON.stringify(val);
    }
    return val.toString();
  }

  onMount(async () => {
    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.scope && data.scope.includes("admin")) {
          email = data.email || "Admin";
          scope = data.scope;
          status = 1;
          // Load database relations
          await fetchRelations();
        } else {
          throw new Error("Not an admin");
        }
      } else {
        throw new Error("Unauthorized");
      }
    } catch (err) {
      status = -1;
      goto("/login");
    }
  });

  async function fetchRelations() {
    relationsLoading = true;
    try {
      const res = await fetch("/api/admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: "::relations" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rows) {
          relations = data.rows.map((row: any[]) => formatDataValue(row[0])).sort();
        }
      }
    } catch (e) {
      console.error("Failed to load relations", e);
      toast.error("Failed to load database relations list");
    } finally {
      relationsLoading = false;
    }
  }

  async function runQuery(customScript?: string) {
    const scriptToRun = customScript || queryText;
    if (!scriptToRun.trim()) return;

    queryLoading = true;
    queryResult = null;
    queryError = null;

    try {
      const res = await fetch("/api/admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptToRun }),
      });
      const data = await res.json();
      if (res.ok) {
        queryResult = {
          headers: data.headers || [],
          rows: data.rows || [],
        };
        toast.success(`Query successful (${data.rows?.length || 0} rows)`);
      } else {
        queryError = data.error || "An unknown error occurred during execution.";
        toast.error("Query failed");
      }
    } catch (e: any) {
      queryError = e.message || "Failed to contact admin query API.";
      toast.error("Connection error");
    } finally {
      queryLoading = false;
    }
  }

  async function selectRelation(rel: string) {
    selectedRelation = rel;
    selectedSchema = null;
    
    // Fetch schema columns
    try {
      const resSchema = await fetch("/api/admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: `::columns ${rel}` }),
      });
      if (resSchema.ok) {
        selectedSchema = await resSchema.json();
      }
    } catch (e) {
      console.error(`Failed to load schema for ${rel}`, e);
      toast.error("Failed to fetch table schema columns");
    }

    // Auto-populate query editor to select * from relation
    if (selectedSchema && selectedSchema.rows) {
      const colNames = selectedSchema.rows.map(row => formatDataValue(row[0]));
      const keysStr = colNames.join(", ");
      queryText = `?[${keysStr}] := *${rel}{${keysStr}}`;
      runQuery(queryText);
    } else {
      queryText = `// Error loading relation metadata`;
    }
  }

  async function quickTruncate(rel: string) {
    if (!confirm(`Are you absolutely sure you want to truncate table "${rel}"? This will wipe all rows.`)) {
      return;
    }
    const truncateScript = `:replace ${rel} { }`;
    await runQuery(truncateScript);
    await selectRelation(rel);
  }

  async function quickDrop(rel: string) {
    if (!confirm(`WARNING: Are you absolutely sure you want to DROP table "${rel}"? This will completely delete the table structure and all data.`)) {
      return;
    }
    const dropScript = `::drop ${rel}`;
    await runQuery(dropScript);
    selectedRelation = "";
    selectedSchema = null;
    await fetchRelations();
  }

  function applyTemplate(query: string) {
    if (!query) return;
    queryText = query;
    runQuery(query);
  }
</script>

{#if status === 0}
  <div class="flex min-h-svh flex-col items-center justify-center bg-background text-foreground">
    <Spinner class="size-8 text-primary" />
    <p class="mt-4 text-xs font-medium tracking-wider text-muted-foreground">Verifying Administrator Session...</p>
  </div>
{:else if status === 1}
  <div class="min-h-svh bg-background text-foreground flex flex-col font-sans admin-console">
    
    <!-- Top Nav Header (matching Svelte app structure/themes) -->
    <header class="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/85 px-6 py-3.5 backdrop-blur-md shadow-xs">
      <div class="flex items-center space-x-3">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <Database class="size-4.5" />
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-foreground">Monada Admin Console</h1>
          <p class="text-[10px] text-muted-foreground">Runtime Database Controller</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="hidden items-center space-x-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs text-muted-foreground md:flex">
          <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Admin: <strong class="font-semibold text-foreground">{email}</strong></span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onclick={() => goto("/")}
          class="flex items-center space-x-1.5"
        >
          <ArrowLeft class="size-3.5" />
          <span>Exit Console</span>
        </Button>
      </div>
    </header>

    <!-- Main Workspace Split-panel -->
    <div class="flex h-[calc(100vh-65px)] overflow-hidden">
      
      <!-- Left Sidebar: Tables List -->
      <aside class="w-80 flex flex-col border-r border-border bg-card shrink-0">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20">
          <div class="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Layers class="size-3.5 text-primary" />
            <span>Stored Relations ({relations.length})</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            class="size-7"
            onclick={fetchRelations}
            disabled={relationsLoading}
            title="Refresh Relations"
          >
            <RefreshCw class="size-3.5 {relationsLoading ? 'animate-spin' : ''}" />
          </Button>
        </div>

        <!-- Scrollable list of relations -->
        <div class="flex-1 overflow-y-auto p-3 space-y-1">
          {#if relationsLoading && relations.length === 0}
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Spinner class="size-5 text-muted-foreground mb-2" />
              <span class="text-xs">Loading database schema...</span>
            </div>
          {:else if relations.length === 0}
            <div class="py-12 text-center text-xs text-muted-foreground">
              No relations found. Create one using the console.
            </div>
          {:else}
            {#each relations as rel}
              <div 
                role="button"
                tabindex="0"
                onclick={() => selectRelation(rel)}
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectRelation(rel); }}
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all duration-200 group border cursor-pointer select-none
                  {selectedRelation === rel 
                    ? 'bg-primary/10 text-primary border-primary/20 font-semibold shadow-xs' 
                    : 'bg-transparent text-muted-foreground border-transparent hover:bg-muted/55 hover:text-foreground'}"
              >
                <div class="flex items-center space-x-2 truncate">
                  <TableProperties class="size-3.5 shrink-0 {selectedRelation === rel ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}" />
                  <span class="truncate">{rel}</span>
                </div>
                
                <!-- Quick delete icons visible on hover -->
                <div class="hidden group-hover:flex items-center space-x-1 shrink-0 pl-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="size-6 hover:text-amber-500"
                    onclick={(e) => { e.stopPropagation(); quickTruncate(rel); }}
                    title="Truncate table (Wipe all data)"
                  >
                    <Trash2 class="size-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="size-6 hover:text-destructive"
                    onclick={(e) => { e.stopPropagation(); quickDrop(rel); }}
                    title="Drop table (Delete schema & data)"
                  >
                    <AlertTriangle class="size-3" />
                  </Button>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <!-- Schema Column Metadata view -->
        {#if selectedRelation && selectedSchema}
          <div class="border-t border-border bg-muted/10 p-4">
            <h4 class="text-[9px] font-bold uppercase tracking-wider text-primary mb-2.5">Columns: {selectedRelation}</h4>
            <div class="max-h-48 overflow-y-auto space-y-1.5 text-xs">
              {#each selectedSchema.rows as col}
                <div class="flex items-center justify-between border-b border-border/40 pb-1 font-mono text-[11px]">
                  <span class="text-foreground font-medium">{formatDataValue(col[0])}</span>
                  <div class="flex items-center space-x-1.5">
                    <span class="text-muted-foreground text-[10px]">{formatDataValue(col[1])}</span>
                    {#if col[2] && formatDataValue(col[2]) === 'true'}
                      <span class="bg-primary/10 text-primary border border-primary/20 px-1 rounded-[3px] text-[8px] font-bold uppercase">KEY</span>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </aside>

      <!-- Right Main content: console editor & results -->
      <main class="flex-1 flex flex-col bg-background overflow-hidden">
        
        <!-- Top Half: Query Editor -->
        <section class="h-1/2 min-h-[280px] flex flex-col border-b border-border p-5">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Terminal class="size-4 text-primary" />
              <span>CozoScript Query Console</span>
            </div>

            <!-- Preset Queries Dropdown -->
            <div class="flex items-center space-x-2">
              <label for="template-select" class="text-xs text-muted-foreground font-medium">Load Template:</label>
              <select 
                id="template-select"
                onchange={(e) => applyTemplate((e.target as HTMLSelectElement).value)}
                class="rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">-- Choose Preset --</option>
                {#each templates as t}
                  <option value={t.query}>{t.name}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Query Editor textarea container -->
          <div class="flex-1 min-h-0 flex flex-col rounded-xl border border-border bg-card focus-within:ring-1 focus-within:ring-ring overflow-hidden">
            <Textarea
              bind:value={queryText}
              placeholder="// Type your CozoScript query here...&#10;// E.g., ?[a] := a in [1, 2, 3]&#10;// Click Run Query to execute."
              class="flex-1 p-4 font-mono text-xs bg-transparent text-foreground outline-none resize-none border-none leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            <div class="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2 shrink-0">
              <span class="text-[10px] text-muted-foreground font-mono">Tip: Wrap multiple commands in curly braces {"{ ... }"} for atomic execution</span>
              
              <Button 
                onclick={() => runQuery()}
                disabled={queryLoading || !queryText.trim()}
                size="sm"
                class="flex items-center space-x-1.5 shadow-sm"
              >
                {#if queryLoading}
                  <Spinner class="size-3.5 text-primary-foreground" />
                  <span>Executing...</span>
                {:else}
                  <Play class="size-3.5 fill-current" />
                  <span>Run Query</span>
                {/if}
              </Button>
            </div>
          </div>
        </section>

        <!-- Bottom Half: Output Grid -->
        <section class="h-1/2 flex flex-col overflow-hidden bg-background">
          <div class="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <LayoutDashboard class="size-4 text-primary" />
              <span>Query Execution Output</span>
            </div>

            <!-- Tab Switcher (Data Table vs JSON view) -->
            {#if queryResult}
              <Tabs value={activeTab} onValueChange={(v) => activeTab = v}>
                <TabsList class="h-8 p-0.5 bg-muted">
                  <TabsTrigger value="table" class="h-7 text-xs px-3">Data Table</TabsTrigger>
                  <TabsTrigger value="json" class="h-7 text-xs px-3">Raw JSON</TabsTrigger>
                </TabsList>
              </Tabs>
            {/if}
          </div>

          <!-- Dynamic Output Display -->
          <div class="flex-1 overflow-auto p-5">
            {#if queryLoading}
              <div class="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Spinner class="size-7 text-primary mb-3" />
                <span class="text-xs font-medium">Running query on CozoDB...</span>
              </div>
            {:else if queryError}
              <div class="flex items-start space-x-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive-foreground">
                <AlertTriangle class="size-5 shrink-0 text-destructive mt-0.5" />
                <div class="flex-1 overflow-hidden">
                  <h3 class="text-sm font-bold text-destructive">Query Failed</h3>
                  <pre class="mt-2 font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-destructive/5 p-3 rounded-lg border border-destructive/15 leading-relaxed text-foreground">{queryError}</pre>
                </div>
              </div>
            {:else if queryResult}
              {#if activeTab === 'table'}
                {#if queryResult.rows.length === 0}
                  <div class="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border text-muted-foreground">
                    <CheckCircle class="size-8 text-primary/45 mb-2.5" />
                    <span class="text-xs">Query completed successfully. Empty result set (0 rows).</span>
                  </div>
                {:else}
                  <div class="overflow-x-auto rounded-lg border border-border shadow-xs bg-card">
                    <Table.Root>
                      <Table.Header class="bg-muted/30">
                        <Table.Row>
                          {#each queryResult.headers as header}
                            <Table.Head class="font-semibold">{header}</Table.Head>
                          {/each}
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {#each queryResult.rows as row}
                          <Table.Row class="hover:bg-muted/10">
                            {#each row as col}
                              <Table.Cell class="font-mono text-[11px] whitespace-nowrap text-foreground">
                                {formatDataValue(col)}
                              </Table.Cell>
                            {/each}
                          </Table.Row>
                        {/each}
                      </Table.Body>
                    </Table.Root>
                  </div>
                  <div class="mt-2 text-right text-[10px] text-muted-foreground font-mono">
                    Returned {queryResult.rows.length} rows
                  </div>
                {/if}
              {:else}
                <!-- Raw JSON tab view -->
                <pre class="bg-card border border-border rounded-xl p-4 font-mono text-[11px] text-foreground overflow-x-auto whitespace-pre-wrap max-h-full leading-relaxed shadow-inner">{JSON.stringify(queryResult, null, 2)}</pre>
              {/if}
            {:else}
              <div class="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border border-dashed border-border">
                <Database class="size-8 text-muted-foreground/30 mb-2.5" />
                <span class="text-xs">No query results to display. Run a script or select a table from the sidebar.</span>
              </div>
            {/if}
          </div>
        </section>
      </main>
    </div>
  </div>
{/if}

<style>
  .admin-console :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }
  .admin-console :global(::-webkit-scrollbar-track) {
    background: transparent;
  }
  .admin-console :global(::-webkit-scrollbar-thumb) {
    background: var(--border);
    border-radius: 9999px;
  }
  .admin-console :global(::-webkit-scrollbar-thumb:hover) {
    background: var(--muted-foreground);
  }
  .admin-console :global(*) {
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
</style>
