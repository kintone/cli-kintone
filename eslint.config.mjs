import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";
import websiteConfig from "./website/eslint.config.mjs";
import featuresConfig from "./features/eslint.config.mjs";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/lib",
      "**/dist",
      "**/coverage",
      "**/allure-report",
      "**/allure-results",
      // website package
      "website/.docusaurus",
      "website/build",
      // Auto generated file
      "website/contributors.json",
      "assets",
    ],
  },
  ...presetsNodeTypescriptPrettier,
  {
    rules: {
      curly: ["error", "all"],
      "func-style": ["error"],

      "@typescript-eslint/no-empty-object-type": "off",

      "@typescript-eslint/no-wrapper-object-types": "off",

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
      "n/no-missing-import": "off",
    },
  },
  ...websiteConfig.map((configObject) => ({
    files: ["website/**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    ...configObject,
  })),
  ...featuresConfig.map((configObject) => ({
    files: ["features/**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    ...configObject,
  })),
];
