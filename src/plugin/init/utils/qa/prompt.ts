import { confirm, input } from "@inquirer/prompts";
import { getMessage } from "../messages";
import {
  validateForDescription,
  validateForName,
  validateForProjectName,
} from "./validator";

export type SupportLang = "En" | "Ja" | "Zh" | "Es";

export const promptForProjectName = async (defaultAnswer: string) => {
  return input({
    message: getMessage("Q_ProjectName"),
    default: defaultAnswer,
    validate: (value) =>
      validateForProjectName(value) ? true : getMessage("Q_ProjectNameError"),
  });
};

export const promptForName = async (
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: getMessage(`Q_Name${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForName(value) ? true : getMessage(`Q_Name${supportLang}Error`),
  });
};

export const promptForDescription = async (
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: getMessage(`Q_Description${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForDescription(value)
        ? true
        : getMessage(`Q_Description${supportLang}Error`),
  });
};

const promptForSupportLang = async (
  supportLang: Exclude<SupportLang, "En">,
  defaultAnswer: boolean = false,
) => {
  return confirm({
    default: defaultAnswer,
    message: getMessage(`Q_Support${supportLang}`),
  });
};

export const promptForHomepage = async (supportLang: SupportLang) => {
  return input({
    message: getMessage(`Q_WebsiteUrl${supportLang}`),
  });
};

export type LangAnswers = {
  name: string;
  description: string;
  homepage?: string;
};

const emptyToUndefined = (v: string): string | undefined =>
  v === "" ? undefined : v;

export const promptForLang = async <R extends boolean = false>(options: {
  required?: R;
  supportLang: SupportLang;
  defaultName: string;
  defaultDescription?: string;
}): Promise<R extends true ? LangAnswers : Partial<LangAnswers>> => {
  // NOTE: lang en is always required
  if (!options.required && options.supportLang !== "En") {
    const support = await promptForSupportLang(options.supportLang);
    if (!support) {
      return {} as R extends true ? LangAnswers : Partial<LangAnswers>;
    }
  }
  const name = await promptForName(options.supportLang, options.defaultName);
  const description = await promptForDescription(
    options.supportLang,
    options.defaultDescription || name,
  );
  const homepage = emptyToUndefined(
    await promptForHomepage(options.supportLang),
  );
  return { name, description, homepage } as R extends true
    ? LangAnswers
    : Partial<LangAnswers>;
};
