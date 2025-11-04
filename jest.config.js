/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src", "<rootDir>/features"],
  clearMocks: true,
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__tests__/setup.ts",
    "<rootDir>/src/plugin/packer/__tests__/helpers/",
    "fixtures",
    // FIXME: Tests that stopped working due to migration from create-plugin
    "src/plugin/init/__e2e__",
    "src/plugin/init/utils/__tests__/generator.test.ts",
  ],
};
module.exports = config;
