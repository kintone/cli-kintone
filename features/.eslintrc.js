/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  rules: {
    "new-cap": ["warn", { capIsNewExceptions: ["Given", "When", "Then"] }],
    "no-invalid-this": "off",
  },
};
module.exports = config;
