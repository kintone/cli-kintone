import type { Lang } from "./lang";
import type { BoundMessage } from "./messages";
import {
  promptForDescription,
  promptForHomepage,
  promptForName,
  promptForOptionalDescription,
  promptForOptionalName,
  promptForProjectName,
  promptForSupportLang,
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
  outputDir: string | undefined,
  lang: Lang,
): Promise<Answers> => {
  // プロジェクト名の質問（outputDirが未指定の場合のみ）
  const projectName =
    outputDir === undefined
      ? await promptForProjectName(m, DEFAULT_PROJECT_NAME)
      : getDefaultName(outputDir);

  const enName = await promptForName(m, "En", projectName);
  const enDescription = await promptForDescription(m, "En", enName);

  const supportJa = await promptForSupportLang(m, "Ja", lang === "ja");
  const jaName = supportJa ? await promptForOptionalName(m, "Ja") : undefined;
  const jaDescription = supportJa
    ? await promptForOptionalDescription(m, "Ja")
    : undefined;

  const supportZh = await promptForSupportLang(m, "Zh");
  const zhName = supportZh ? await promptForOptionalName(m, "Zh") : undefined;
  const zhDescription = supportZh
    ? await promptForOptionalDescription(m, "Zh")
    : undefined;

  const supportEs = await promptForSupportLang(m, "Es");
  const esName = supportEs ? await promptForOptionalName(m, "Es") : undefined;
  const esDescription = supportEs
    ? await promptForOptionalDescription(m, "Es")
    : undefined;

  const enHomepage = await promptForHomepage(m, "En");
  const jaHomepage = supportJa ? await promptForHomepage(m, "Ja") : undefined;
  const zhHomepage = supportZh ? await promptForHomepage(m, "Zh") : undefined;
  const esHomepage = supportEs ? await promptForHomepage(m, "Es") : undefined;

  const result: Answers = {
    projectName: projectName,
    name: {
      en: enName,
      ja: jaName,
      zh: zhName,
      es: esName,
    },
    description: {
      en: enDescription,
      ja: jaDescription,
      zh: zhDescription,
      es: esDescription,
    },
  };
  if (enHomepage) {
    result.homepage_url = {
      en: enHomepage,
      ja: jaHomepage,
      zh: zhHomepage,
      es: esHomepage,
    };
  }
  return result;
};
