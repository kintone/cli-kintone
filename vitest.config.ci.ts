import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      reporters: ["default", "allure-vitest/reporter"],
      pool: "forks",
      poolOptions: {
        forks: { singleFork: true },
      },
    },
  }),
);
