import { defineConfig } from "vite";
import { builtinModules } from "node:module";
import path from "node:path";

export default defineConfig({
  build: {
    target: "node20",
    outDir: "dist",
    ssr: "src/cli/main.ts",
    rollupOptions: {
      external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
      output: {
        entryFileNames: "index.cjs",
        format: "cjs",
      },
    },
    minify: true,
    sourcemap: false,
  },
  ssr: {
    noExternal: true,
  },
  resolve: {
    conditions: ["node", "require"],
    alias: {
      "@kintone/rest-api-client": path.resolve(
        "node_modules/@kintone/rest-api-client/lib/src/index.js",
      ),
    },
  },
});
