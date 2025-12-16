import type { Rule } from "eslint";

/**
 * Disallow cybozu.data access
 */
const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prevents access to `cybozu.data`, an internal and unsupported API that may change without notice.",
    },
    messages: {
      "forbidden-cybozu-data-access": "Accessing `cybozu.data` is not allowed.",
    },
  },
  create: (context) => ({
    // Matches:
    //   cybozu.data
    //   cybozu["data"]
    //   cybozu?.data
    //   cybozu?.["data"]
    'MemberExpression[object.type="Identifier"][object.name="cybozu"][property.name="data"]':
      (node: Rule.Node) => {
        context.report({
          node,
          messageId: "forbidden-cybozu-data-access",
        });
      },
  }),
};

export default rule;
