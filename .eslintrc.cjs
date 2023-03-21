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

    // https://github.com/AlexSergey/eslint-plugin-file-extension-in-import-ts
    "file-extension-in-import-ts/file-extension-in-import-ts": "error",

    // https://github.com/mysticatea/eslint-plugin-node
    "node/file-extension-in-import": "error",
    "node/no-missing-import": "off",

    // https://github.com/import-js/eslint-plugin-import
    "import/no-unresolved": ["error", { ignore: ["\\.js$"] }],
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    "unicorn/prefer-module": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-top-level-await": "error",
  },
  plugins: ["unicorn", "file-extension-in-import-ts"],
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};

module.exports = config;
