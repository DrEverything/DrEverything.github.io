<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
</script>

<div class="wrap">
  <p class="code">4<span>0</span>4</p>
  <p class="msg">Page not found</p>
  <p class="sub">
    The page you're looking for doesn't exist or has been moved.
  </p>
  <code class="path">{$page.url.pathname}</code>
  <hr />
  <div class="actions">
    <button class="btn-primary" onclick={() => goto("/")}>Go home</button>
    <button class="btn-secondary" onclick={() => history.back()}>Go back</button
    >
  </div>
</div>

<style>
  .wrap {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    background: var(--background);
  }
  .code {
    font-size: clamp(72px, 15vw, 120px);
    font-weight: 500;
    letter-spacing: -6px;
    line-height: 1;
    margin: 0;
    color: var(--foreground);
  }
  .code span {
    color: var(--primary);
  }
  .msg {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--foreground);
    margin: 1.25rem 0 0.5rem;
  }
  .sub {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin: 0 0 1.5rem;
    max-width: 360px;
    line-height: 1.6;
  }
  .path {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px 12px;
  }
  hr {
    width: 40px;
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.75rem 0;
  }
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .btn-primary {
    background: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: 8px;
    padding: 10px 22px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  .btn-secondary {
    background: var(--secondary);
    color: var(--secondary-foreground);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 22px;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .btn-primary:hover {
    opacity: 0.88;
  }
  .btn-secondary:hover {
    border-color: var(--ring);
  }
</style>
