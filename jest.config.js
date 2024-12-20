/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src", "<rootDir>/features"],
  clearMocks: true,
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__tests__/setup.ts",
    "<rootDir>/src/plugin/packer/__tests__/helpers/",
    "fixtures",
  ],
};
module.exports = config;
