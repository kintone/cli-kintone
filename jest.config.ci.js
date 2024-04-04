const defaultConfig = require("./jest.config");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = Object.assign(defaultConfig, {
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testEnvironment: "allure-jest/node",
});
module.exports = config;
