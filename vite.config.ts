import { defineConfig, type Plugin } from "vite";
import preact from "@preact/preset-vite";

// Встраивает собранный CSS прямо в <style> внутри index.html и убирает
// сам .css-файл из сборки — на один HTTP-запрос меньше. Внешние <link>
// (например, Google Fonts) не трогаются: ищем только локальный ассет по имени.
function inlineLocalCss(): Plugin {
  return {
    name: "inline-local-css",
    enforce: "post",
    generateBundle(_, bundle) {
      const cssFiles = Object.keys(bundle).filter((f) => f.endsWith(".css"));
      for (const htmlFile of Object.keys(bundle).filter((f) =>
        f.endsWith(".html"),
      )) {
        const html = bundle[htmlFile];
        if (html.type !== "asset" || typeof html.source !== "string") continue;
        let source = html.source;
        for (const cssFile of cssFiles) {
          const asset = bundle[cssFile];
          if (asset.type !== "asset") continue;
          const name = cssFile.split("/").pop();
          const link = new RegExp(`<link[^>]*?href="[^"]*${name}"[^>]*?>`);
          source = source.replace(link, `<style>${asset.source}</style>`);
          delete bundle[cssFile];
        }
        html.source = source;
      }
    },
  };
}

// base: "./" — относительные пути к ассетам, чтобы сборка работала
// на GitHub Pages из подкаталога /<repo>/ без знания имени репозитория.
//
// preact(): алиасит react/react-dom на preact/compat — тот же API React,
// но ~4 КБ gzip вместо ~56. Типы по-прежнему берутся из @types/react (tsc).
export default defineConfig({
  base: "./",
  plugins: [preact(), inlineLocalCss()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
