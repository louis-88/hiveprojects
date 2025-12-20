import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  // Repo = hiveprojects -> wichtig für GitHub Pages Assets
  base: "/hiveprojects/",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    // Build soll NICHT die AI-Studio index.html nehmen,
    // sondern pages.html als "index" ausgeben.
    rollupOptions: {
      input: {
        index: resolve(__dirname, "pages.html"),
      },
    },
  },
});
