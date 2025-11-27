import path from "path";
import { resolveGitHubTemplateSource } from "./template/github";
import { downloadAndExtractFromUrl } from "./template/downloader";
import type { ManifestPatch } from "./template/manifest";
import { updateManifests } from "./template/manifest";
import {
  updatePackageJson,
  type PackageJsonPatch,
} from "./template/pacakge-json";
import { logger } from "../../../utils/log";
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
