import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// https://stackoverflow.com/a/74185754
const docusaurusModuleAliases = [
  "@docusaurus/Link",
  "@docusaurus/useDocusaurusContext",
  "@theme/Heading",
  "@theme/Layout",
  "@theme/ThemedImage",
  "@site/static",
  "@site/src",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...compat.extends("plugin:@docusaurus/recommended"),
  {
    rules: {
      "n/no-missing-import": [
        "error",
        {
          allowModules: docusaurusModuleAliases,
        },
      ],

      "n/no-missing-require": [
        "error",
        {
          allowModules: docusaurusModuleAliases,
        },
      ],
    },
  },
];
