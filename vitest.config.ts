import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ["src/**/*.test.ts", "features/**/*.test.ts"],
    exclude: [
      "node_modules",
      "src/__tests__/setup.ts",
      "src/plugin/pack/__tests__/helpers/**",
      "src/plugin/init/utils/__tests__/helpers/**",
      "**/fixtures/**",
      "src/plugin/init/__e2e__/**",
    ],
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
