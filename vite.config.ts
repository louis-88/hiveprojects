
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base to '/' or your repo name if not a custom domain
  // For GitHub Pages: base: '/your-repo-name/'
  base: './',
});
