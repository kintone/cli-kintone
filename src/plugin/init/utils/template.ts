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

export const setupTemplate = async (opts: {
  templateName: string;
  /** Must exist before the call. */
  outputDir: string;
  manifestPatch: ManifestPatch;
  packageJsonPatch: PackageJsonPatch;
}) => {
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
