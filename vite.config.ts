import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: repo name = hiveprojects
  base: "/hiveprojects/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
