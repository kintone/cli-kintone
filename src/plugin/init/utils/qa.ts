import { promptForLang, promptForProjectName } from "../utils/qa/prompt";
import path from "path";

export type Answers = {
  projectName: string;
  name: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  homepage_url?: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
};

export const DEFAULT_PROJECT_NAME = "kintone-plugin";

export const runPrompt = async (
  inputName: string | undefined,
): Promise<Answers> => {
  const projectName =
    inputName === undefined
      ? await promptForProjectName(`./${DEFAULT_PROJECT_NAME}`)
      : inputName;

  const defaultName = path.basename(projectName);

  const en = await promptForLang({
    supportLang: "En",
    required: true,
    defaultName: defaultName,
  });
  const ja = await promptForLang({
    supportLang: "Ja",
    defaultName: en.name,
    defaultDescription: en.description,
  });
  const zh = await promptForLang({
    supportLang: "Zh",
    defaultName: en.name,
    defaultDescription: en.description,
  });
  const es = await promptForLang({
    supportLang: "Es",
    defaultName: en.name,
    defaultDescription: en.description,
  });

  const result: Answers = {
    projectName,
    name: {
      en: en.name,
      ja: ja.name,
      zh: zh.name,
      es: es.name,
    },
    description: {
      en: en.description,
      ja: ja.description,
      zh: zh.description,
      es: es.description,
    },
  };
  if (en.homepage) {
    result.homepage_url = {
      en: en.homepage,
      ja: ja.homepage,
      zh: zh.homepage,
      es: es.homepage,
    };
  }
  return result;
};
