import { defineConfig } from "vite";
import multiInput from "rollup-plugin-multi-input";
import glob from "glob";

export default defineConfig({
  // Dev note: The logic below is used to preserve process.env in the build files
  // Ref: https://github.com/vitejs/vite/issues/3229#issuecomment-1028093830
  define: {
    "process.env.KINTONE_BASE_URL": "process.env.KINTONE_BASE_URL",
    "process.env.KINTONE_USERNAME": "process.env.KINTONE_USERNAME",
    "process.env.KINTONE_PASSWORD": "process.env.KINTONE_PASSWORD",
    "process.env.KINTONE_API_TOKEN": "process.env.KINTONE_API_TOKEN",
    "process.env.KINTONE_BASIC_AUTH_USERNAME":
      "process.env.KINTONE_BASIC_AUTH_USERNAME",
    "process.env.KINTONE_BASIC_AUTH_PASSWORD":
      "process.env.KINTONE_BASIC_AUTH_PASSWORD",
    "process.env.KINTONE_GUEST_SPACE_ID": "process.env.KINTONE_GUEST_SPACE_ID",
    "process.env.HTTPS_PROXY": "process.env.HTTPS_PROXY",
    "process.env.https_proxy": "process.env.https_proxy",
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
