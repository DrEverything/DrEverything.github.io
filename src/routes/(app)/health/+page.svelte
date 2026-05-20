<script lang="ts">
  // API Client helper
  async function post(path: string, body?: unknown) {
    const res = await fetch(`/api/health/${path}`, {
      method: "POST",
      credentials: "include",
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw Object.assign(new Error(json.error ?? res.statusText), {
        status: res.status,
      });
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
</script>

<h1>Hey</h1>
