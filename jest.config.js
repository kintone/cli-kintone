/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "fixtures"],
  testRegex: "/__tests__/.*\\.test\\.ts$",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
