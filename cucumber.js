const config = {
  default: {
    formatOptions: { snippetInterface: "synchronous" },
    requireModule: ["ts-node/register"],
    require: ["features/step_definitions/**/*.ts"],
    publishQuiet: true,
  },
};
module.exports = config;
