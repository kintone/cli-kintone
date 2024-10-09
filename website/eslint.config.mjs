import path from "node:path";
import { fileURLToPath } from "node:url";
// eslint-disable-next-line n/no-extraneous-import
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("plugin:@docusaurus/recommended"),
  {
    rules: {
      "n/no-missing-import": [
        "error",
        {
          allowModules: [
            "@docusaurus/Link",
            "@docusaurus/useDocusaurusContext",
            "@theme/Heading",
            "@theme/Layout",
            "@theme/ThemedImage",
            "@site/static",
            "@site/src",
          ],
        },
      ],

      "n/no-missing-require": [
        "error",
        {
          allowModules: [
            "@docusaurus/Link",
            "@docusaurus/useDocusaurusContext",
            "@theme/Heading",
            "@theme/Layout",
            "@theme/ThemedImage",
            "@site/static",
            "@site/src",
          ],
        },
      ],
    },
  },
];
