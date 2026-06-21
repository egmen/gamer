import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// base: "./" — относительные пути к ассетам, чтобы сборка работала
// на GitHub Pages из подкаталога /<repo>/ без знания имени репозитория.
//
// preact(): алиасит react/react-dom на preact/compat — тот же API React,
// но ~4 КБ gzip вместо ~56. Типы по-прежнему берутся из @types/react (tsc).
export default defineConfig({
  base: "./",
  plugins: [preact()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
