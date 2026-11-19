// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'https://brian02oriel.github.io',
  base: '/netzwerk-neu-lernen',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
