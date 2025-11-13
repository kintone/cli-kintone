import path from "path";
import {
  downloadAndExtractTemplate,
  isDefaultTemplateExists,
} from "./template/github";
import type { ManifestJsonObjectForUpdate } from "./template/manifest";
import { updateManifestsForAnswers } from "./template/manifest";
import { updatePackageJson } from "./template/pacakge-json";

// NOTE: this object has only fields for editting
export type ManifestJsonObjectForTemplate = {
  name: {
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
  };
  homepage_url?: {
    ja: string;
    en: string;
    zh: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
  };
};

export const setupTemplate = async (opts: {
  packageName: string;
  templateName: string;
  outputDir: string;
  answers: ManifestJsonObjectForUpdate;
}) => {
  if (!(await isDefaultTemplateExists(opts.templateName))) {
    throw new Error("template not found");
  }

  await downloadAndExtractTemplate({
    templateName: opts.templateName,
    outputDir: opts.outputDir,
  });

  updateManifestsForAnswers({
    manifestPath: path.join(opts.outputDir, "manifest.json"),
    answers: opts.answers,
  });

  updatePackageJson({
    packageJsonPath: path.join(opts.outputDir, "package.json"),
    packageName: opts.packageName,
  });
};
