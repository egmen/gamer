import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" — относительные пути к ассетам, чтобы сборка работала
// на GitHub Pages из подкаталога /<repo>/ без знания имени репозитория.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
