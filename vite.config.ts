import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ESM-safe replacement for __dirname
const pagesEntry = new URL("./pages.html", import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],

  // GitHub Pages repo name
  base: "/hiveprojects/",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: pagesEntry,
      },
    },
  },
});
