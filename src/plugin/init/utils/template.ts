import path from "path";
import {
  downloadAndExtractTemplate,
  isDefaultTemplateExists,
} from "./template/github";
import type { ManifestJsonObjectForUpdate } from "./template/manifest";
import { updateManifestsForAnswers } from "./template/manifest";
import { updatePackageJson } from "./template/pacakge-json";
import { logger } from "../../../utils/log";
import { mkdir, stat } from "fs/promises";

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

const checkDirectoryExists = async (dirPath: string): Promise<boolean> => {
  try {
    await stat(dirPath);
    return true;
  } catch {
    return false;
  }
};

export const setupTemplate = async (opts: {
  packageName: string;
  templateName: string;
  outputDir: string;
  answers: ManifestJsonObjectForUpdate;
}) => {
  // Verify template exists
  logger.debug(`verifying template exists: ${opts.templateName}`);
  if (!(await isDefaultTemplateExists(opts.templateName))) {
    throw new Error("template not found");
  }
  logger.debug(`template verified: ${opts.templateName}`);

  // Verify output directory does not exist
  logger.debug(`verifying output directory: ${opts.outputDir}`);
  const directoryExists = await checkDirectoryExists(opts.outputDir);
  if (directoryExists) {
    throw new Error("output directory already exists");
  }
  logger.debug("output directory is available");

  // Create output directory
  await mkdir(opts.outputDir, { recursive: true });
  logger.debug(`downloading template: ${opts.templateName}`);

  await downloadAndExtractTemplate({
    templateName: opts.templateName,
    outputDir: opts.outputDir,
  });
  logger.debug(`template downloaded: ${opts.templateName}`);

  logger.debug("updating manifest.json");
  await updateManifestsForAnswers({
    manifestPath: path.join(opts.outputDir, "manifest.json"),
    answers: opts.answers,
  });
  logger.debug("manifest.json updated");

  logger.debug(`updating package.json: ${opts.packageName}`);
  await updatePackageJson({
    packageJsonPath: path.join(opts.outputDir, "package.json"),
    packageName: opts.packageName,
  });
  logger.debug("package.json updated");
};
