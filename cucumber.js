// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
const config = {
  default: {
    formatOptions: { snippetInterface: "synchronous" },
    requireModule: ["ts-node/register"],
    require: ["features/supports/**/*.ts", "features/step_definitions/**/*.ts"],
    parallel: 10,
  },
};
module.exports = config;
