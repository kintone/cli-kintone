import { confirm, input } from "@inquirer/prompts";
import type { BoundMessage } from "../messages";
import {
  validateForDescription,
  validateForName,
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

export type LangAnswers = {
  name: string;
  description: string;
  homepage?: string;
};

const emptyToUndefined = (v: string): string | undefined =>
  v === "" ? undefined : v;

export const promptForLang = async <R extends boolean = false>(
  m: BoundMessage,
  options: {
    required?: R;
    supportLang: SupportLang;
    defaultName: string;
    defaultDescription?: string;
  },
): Promise<R extends true ? LangAnswers : Partial<LangAnswers>> => {
  // NOTE: lang en is always required
  if (!options.required && options.supportLang !== "En") {
    const support = await promptForSupportLang(m, options.supportLang);
    if (!support) {
      return {} as R extends true ? LangAnswers : Partial<LangAnswers>;
    }
  }
  const name = await promptForName(m, options.supportLang, options.defaultName);
  const description = await promptForDescription(
    m,
    options.supportLang,
    options.defaultDescription || name,
  );
  const homepage = emptyToUndefined(
    await promptForHomepage(m, options.supportLang),
  );
  return { name, description, homepage } as R extends true
    ? LangAnswers
    : Partial<LangAnswers>;
};
