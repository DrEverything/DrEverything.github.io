import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // you're managing it yourself in static/
    }),
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
    },
  },
  optimizeDeps: {
    include: [
      "@tabler/icons-svelte",
      "@lucide/svelte",
      "layerchart",
      "bits-ui",
      "katex",
      "markdown-it",
      "d3-scale",
      "d3-shape",
      "d3-array",
      "d3-time",
    ],
  },
});
