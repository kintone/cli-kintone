import type { ManifestInterface } from "../../core";
import { PluginZip } from "../../core";
import { logger } from "../../../utils/log";
import type {
  LocalPluginProjectRepository,
  LocalPluginZipRepository,
} from "./interface";
import { PluginManifestValidationError } from "./pack/error";

export const pack: (
  project: LocalPluginProjectRepository,
  pluginZipDestination: LocalPluginZipRepository,
) => Promise<ManifestInterface> = async (project, pluginZipDestination) => {
  const { manifest, sources } = await project.read();

  const result = await manifest.validate(sources);
  result.warnings.forEach((warning) => {
    logger.warn(warning);
  });
  if (!result.valid) {
    throw new PluginManifestValidationError(result.errors);
  }

  // The destination is prepared before the private key is read, so a failure to prepare it is reported first.
  await pluginZipDestination.prepare();

  const privateKey = await project.readPrivateKey();
  logger.debug(`plugin id: ${privateKey.uuid()}`);

  const pluginZip = await PluginZip.build(manifest, privateKey, sources);

  const outputFilePath = await pluginZipDestination.save(pluginZip);
  logger.info(`The plugin file generated: ${outputFilePath}`);
  return manifest;
};
