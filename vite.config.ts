import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Repo-Name für GitHub Pages
  base: "/hiveprojects/",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    // WICHTIG: pages.html direkt als Entry
    rollupOptions: {
      input: "./pages.html",
    },
  },
});
