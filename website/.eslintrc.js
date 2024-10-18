// https://stackoverflow.com/a/74185754
const docusaurusModuleAliases = [
  "@docusaurus/Link",
  "@docusaurus/useDocusaurusContext",
  "@theme/Heading",
  "@theme/Layout",
  "@theme/ThemedImage",
  "@site/static",
  "@site/src",
  "@theme-original/Admonition",
];

/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  extends: ["plugin:@docusaurus/recommended"],
  rules: {
    "node/no-missing-import": [
      "error",
      {
        allowModules: docusaurusModuleAliases,
      },
    ],
    "node/no-missing-require": [
      "error",
      {
        allowModules: docusaurusModuleAliases,
      },
    ],
  },
};
module.exports = config;
