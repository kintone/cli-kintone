const defaultConfig = require("./jest.config");

/** @type {import('jest').Config} */
const config = {
  ...defaultConfig,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testEnvironment: "allure-jest/node",
};
module.exports = config;
