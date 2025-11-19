import path from "path";
import {
  downloadAndExtractTemplate,
  isDefaultTemplateExists,
} from "./template/github";
import type { ManifestPatch } from "./template/manifest";
import { updateManifestsForAnswers } from "./template/manifest";
import {
  updatePackageJson,
  type PackageJsonPatch,
} from "./template/pacakge-json";
import { logger } from "../../../utils/log";
import { mkdir } from "fs/promises";
import { isDirectory } from "../../../utils/file";

export const setupTemplate = async (opts: {
  templateName: string;
  outputDir: string;
  manifestPatch: ManifestPatch;
  packageJsonPatch: PackageJsonPatch;
}) => {
  // Verify template exists
  logger.debug(`verifying template exists: ${opts.templateName}`);
  if (!(await isDefaultTemplateExists(opts.templateName))) {
    throw new Error("template not found");
  }
  logger.debug(`template verified: ${opts.templateName}`);

  // Verify output directory does not exist
  logger.debug(`verifying output directory: ${opts.outputDir}`);
  const directoryExists = await isDirectory(opts.outputDir);
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
    answers: opts.manifestPatch,
  });
  logger.debug("manifest.json updated");

  logger.debug(`updating package.json: ${opts.packageJsonPatch.name}`);
  await updatePackageJson({
    packageJsonPath: path.join(opts.outputDir, "package.json"),
    patch: opts.packageJsonPatch,
  });
  logger.debug("package.json updated");
};
