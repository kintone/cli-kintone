import { defineConfig } from "vite";
import multiInput from "rollup-plugin-multi-input";
import glob from "glob";

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
    rollupOptions: {
      input: glob.sync("lib/**/*.js", { ignore: "**/__tests__/**" }),
      output: {
        format: "cjs",
        dir: "dist",
        entryFileNames: "[name].js",
      },
      plugins: [multiInput({ relative: "lib/" })],
    },
  },
});
