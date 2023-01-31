import { defineConfig } from "vite";
import { resolve } from "path";
import autoExternal from "rollup-plugin-auto-external";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

export default defineConfig({
  // Dev note: The logic below is used to preserve process.env in the build files
  // Ref: https://github.com/vitejs/vite/issues/3229#issuecomment-1028093830
  // In order to use some values of process.env in the build files, please specify as below
  // define: {
  //   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  //   "process.env": "process.env",
  // },
  define: {
    "process.env": "process.env",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/cli/main.ts"),
      formats: ["cjs"],
    },
    rollupOptions: {
      plugins: [autoExternal(), visualizer()],
    },
  },
  plugins: [checker({ typescript: true })],
});
