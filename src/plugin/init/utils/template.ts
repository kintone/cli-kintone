import path from "path";
import { resolveGitHubTemplateSource } from "./template/github.js";
import { downloadAndExtractFromUrl } from "./template/downloader.js";
import type { ManifestPatch } from "./template/manifest.js";
import { updateManifests } from "./template/manifest.js";
import {
  updatePackageJson,
  type PackageJsonPatch,
} from "./template/pacakge-json.js";
import { logger } from "../../../utils/log.js";
import { mkdir } from "fs/promises";

export const setupTemplate = async (opts: {
  templateName: string;
  outputDir: string;
  manifestPatch: ManifestPatch;
  packageJsonPatch: PackageJsonPatch;
}) => {
  // Create output directory
  await mkdir(opts.outputDir, { recursive: true });
  logger.debug(`downloading template: ${opts.templateName}`);

  // Resolve template source from GitHub (includes existence check)
  const source = await resolveGitHubTemplateSource(opts.templateName);

  // Download and extract template
  await downloadAndExtractFromUrl({
    source,
    outputDir: opts.outputDir,
  });
  logger.debug(`template downloaded: ${opts.templateName}`);

  await updateManifests({
    manifestPath: path.join(opts.outputDir, "manifest.json"),
    patch: opts.manifestPatch,
  });

  await updatePackageJson({
    packageJsonPath: path.join(opts.outputDir, "package.json"),
    patch: opts.packageJsonPatch,
  });
};
