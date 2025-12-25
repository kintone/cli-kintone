// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
import type { IConfiguration } from "@cucumber/cucumber/api";

const config: { default: Partial<IConfiguration> } = {
  default: {
    formatOptions: { snippetInterface: "synchronous" },
    requireModule: ["ts-node/register"],
    require: ["features/supports/**/*.ts", "features/step_definitions/**/*.ts"],
    parallel: 10,
  },
};

export default config;
