import { LocalFSDriver } from "../../../core/driver";
import type { ManifestV1JsonObject } from "../../../core/manifest/v1";
import { logger } from "../../../../utils/log";
import type { DeepPartial } from "../../../../utils/types";

export type ManifestPatch = DeepPartial<
  Pick<ManifestV1JsonObject, "name" | "description" | "homepage_url">
>;

export const updateManifestsForAnswers = async (opts: {
  manifestPath: string;
  answers: ManifestPatch;
}) => {
  logger.debug(`reading manifest: ${opts.manifestPath}`);
  const driver = new LocalFSDriver();
  const manifestJson = await driver.readFile(opts.manifestPath, "utf-8");
  const manifest = JSON.parse(manifestJson);
  const newManifest = { ...manifest, ...opts.answers };
  logger.debug(`writing updated manifest: ${opts.manifestPath}`);
  await driver.writeFile(
    opts.manifestPath,
    JSON.stringify(newManifest, null, 2),
  );
  logger.debug("manifest updated");
};
