/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  rules: {
    curly: ["error", "all"],
    "func-style": ["error"],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          object: false,
          "{}": false,
        },
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
  },
};
module.exports = config;
