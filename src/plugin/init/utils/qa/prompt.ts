import { confirm, input } from "@inquirer/prompts";
import type { BoundMessage } from "../messages";
import {
  validateForDescription,
  validateForName,
  validateForOptionalDescription,
  validateForOptionalName,
  validateForProjectName,
} from "./validator";

export type SupportLang = "En" | "Ja" | "Zh" | "Es";

export const promptForProjectName = async (
  m: BoundMessage,
  defaultAnswer: string,
) => {
  return input({
    message: m("Q_ProjectName"),
    default: defaultAnswer,
    validate: (value) =>
      validateForProjectName(value) ? true : m("Q_ProjectNameError"),
  });
};

export const promptForName = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Name${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForName(value) ? true : m(`Q_Name${supportLang}Error`),
  });
};

export const promptForDescription = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Description${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForDescription(value)
        ? true
        : m(`Q_Description${supportLang}Error`),
  });
};

const promptForOptionalName = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Name${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForOptionalName(value) ? true : m(`Q_Name${supportLang}Error`),
  });
};

const promptForOptionalDescription = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Description${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForOptionalDescription(value)
        ? true
        : m(`Q_Description${supportLang}Error`),
  });
};

const promptForSupportLang = async (
  m: BoundMessage,
  supportLang: Exclude<SupportLang, "En">,
  defaultAnswer: boolean = false,
) => {
  return confirm({
    default: defaultAnswer,
    message: m(`Q_Support${supportLang}`),
  });
};

export const promptForHomepage = async (
  m: BoundMessage,
  supportLang: SupportLang,
) => {
  return input({
    message: m(`Q_WebsiteUrl${supportLang}`),
  });
};

export type OptionalLangAnswers = {
  name?: string;
  description?: string;
  homepage?: string;
};

export const promptForOptionalLang = async (
  m: BoundMessage,
  supportLang: Exclude<SupportLang, "En">,
  defaultName: string,
  defaultDescription: string,
): Promise<OptionalLangAnswers> => {
  const support = await promptForSupportLang(m, supportLang);
  if (!support) {
    return {};
  }
  const name = await promptForOptionalName(m, supportLang, defaultName);
  const description = await promptForOptionalDescription(
    m,
    supportLang,
    defaultDescription,
  );
  const homepage = await promptForHomepage(m, supportLang);
  return { name, description, homepage };
};
