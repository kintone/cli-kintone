/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  rules: {
    "new-cap": [
      "warn",
      {
        capIsNewExceptions: [
          "Given",
          "When",
          "Then",
          "BeforeAll",
          "Before",
          "AfterAll",
          "After",
        ],
      },
    ],
    "no-invalid-this": "off",
  },
};
module.exports = config;
