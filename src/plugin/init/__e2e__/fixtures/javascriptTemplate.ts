import type { TestPattern } from "../e2e.test";
import {
  ANSWER_NO,
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
} from "../utils/constants";
import { getBoundMessage } from "../../utils/messages";

const m = getBoundMessage("en");
const template = "javascript";

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-7 Should able to create a plugin with javascript template",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test7",
    commandArgument: `--template ${template}`,
    template,
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "test7-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test7-description",
      },
      {
        question: m("Q_SupportJa"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_SupportZh"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_SupportEs"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_WebsiteUrlEn"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_MobileSupport"),
        answer: ANSWER_NO,
      },
    ],
  },
  expected: {
    success: {
      manifestJson: {
        name: { en: "test7-name" },
        description: { en: "test7-description" },
        desktop: {
          js: ["js/desktop.js"],
          css: ["css/51-typescript-default.css", "css/desktop.css"],
        },
      },
    },
  },
};
