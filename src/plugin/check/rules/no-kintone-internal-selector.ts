import type { Rule } from "eslint";
import type { CallExpression, Literal } from "estree";

/**
 * Disallow using internal kintone UI class names in selectors.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prevents the use of internal kintone UI class names (e.g., `gaia-argoui-`, `-gaia`, `ocean-`, and `kintone-`)",
    },
    messages: {
      "forbidden-classname":
        "Using internal kintone UI class name `{{className}}` is not allowed.",
      "suspicious-classname-literal":
        "Possible use of internal kintone UI class name `{{className}}`.",
    },
  },
  create: (context) => {
    const checked = new WeakSet<Literal>();
    return {
      'CallExpression[callee.property.name="querySelector"]': (
        callExp: CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="querySelectorAll"]': (
        callExp: CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="matches"]': (
        callExp: CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="closest"]': (
        callExp: CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="getElementsByClassName"]': (
        callExp: CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),

      // NOTE: jQuery 等を含む「怪しい文字列リテラル」検知
      Literal: (literal: Literal) => {
        if (checked.has(literal)) {
          return;
        }
        if (typeof literal.value !== "string") {
          return;
        }
        for (const pattern of FORBIDDEN_CLASSNAME_PATTERNS) {
          const match = literal.value.match(pattern);
          if (match) {
            context.report({
              node: literal,
              messageId: "suspicious-classname-literal",
              data: { className: match[0] },
            });
            break;
          }
        }
      },
    };
  },
};

const FORBIDDEN_CLASSNAME_PATTERNS = [
  /gaia-argoui-[A-Za-z0-9_-]*/,
  /[A-Za-z0-9_-]*-gaia/,
  /ocean-[A-Za-z0-9_-]*/,
  /kintone-[A-Za-z0-9_-]*/,
];

const reportForbiddenSelectorCall = (
  context: Rule.RuleContext,
  node: CallExpression,
  checked: WeakSet<Literal>,
) => {
  for (const arg of node.arguments) {
    if (arg.type === "Literal" && typeof arg.value === "string") {
      for (const pattern of FORBIDDEN_CLASSNAME_PATTERNS) {
        const match = arg.value.match(pattern);
        if (match) {
          checked.add(arg);
          context.report({
            node: arg,
            messageId: "forbidden-classname",
            data: { className: match[0] },
          });
          break;
        }
      }
    }
  }
};

export default rule;
