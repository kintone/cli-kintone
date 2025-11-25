import type { BoundMessage } from "./messages";
import {
  promptForDescription,
  promptForHomepage,
  promptForName,
  promptForOptionalLang,
  promptForProjectName,
} from "../utils/qa/prompt";

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

export const getDefaultName = (outputDir: string) =>
  outputDir.replace(/.*\//, "");

export const runPrompt = async (
  m: BoundMessage,
  inputName: string | undefined,
): Promise<Answers> => {
  const projectName =
    inputName === undefined
      ? await promptForProjectName(m, `./${DEFAULT_PROJECT_NAME}`)
      : inputName;

  const defaultName = getDefaultName(projectName);

  const enName = await promptForName(m, "En", defaultName);
  const enDescription = await promptForDescription(m, "En", enName);
  const enHomepage = await promptForHomepage(m, "En");

  const ja = await promptForOptionalLang(m, "Ja", enName, enDescription);
  const zh = await promptForOptionalLang(m, "Zh", enName, enDescription);
  const es = await promptForOptionalLang(m, "Es", enName, enDescription);

  const result: Answers = {
    projectName,
    name: {
      en: enName,
      ja: ja.name,
      zh: zh.name,
      es: es.name,
    },
    description: {
      en: enDescription,
      ja: ja.description,
      zh: zh.description,
      es: es.description,
    },
  };
  if (enHomepage) {
    result.homepage_url = {
      en: enHomepage,
      ja: ja.homepage,
      zh: zh.homepage,
      es: es.homepage,
    };
  }
  return result;
};
