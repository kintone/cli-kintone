import { LocalFSDriver } from "../../../core/driver";
import type { ManifestV1JsonObject } from "../../../core/manifest/v1";
import { logger } from "../../../../utils/log";
import type { DeepPartial } from "../../../../utils/types";

export type ManifestPatch = DeepPartial<
  Pick<ManifestV1JsonObject, "name" | "description" | "homepage_url">
>;

const isEmpty = (v: unknown): boolean =>
  v === null || v === undefined || v === "";

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const omitEmpty = (obj: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => !isEmpty(v)));

const applyPatch = (
  base: Record<string, unknown>,
  patch: ManifestPatch,
): Record<string, unknown> =>
  Object.entries(patch).reduce(
    (acc, [key, value]) => {
      if (isObject(value)) {
        const merged = omitEmpty({
          ...(isObject(acc[key]) ? acc[key] : {}),
          ...value,
        });
        return Object.keys(merged).length > 0
          ? { ...acc, [key]: merged }
          : (delete acc[key], acc);
      }
      return isEmpty(value) ? (delete acc[key], acc) : { ...acc, [key]: value };
    },
    { ...base },
  );

export const updateManifests = async (opts: {
  manifestPath: string;
  patch: ManifestPatch;
}) => {
  logger.debug(`reading manifest: ${opts.manifestPath}`);
  const driver = new LocalFSDriver();
  const manifestJson = await driver.readFile(opts.manifestPath, "utf-8");
  const manifest = JSON.parse(manifestJson);
  const newManifest = applyPatch(manifest, opts.patch);
  logger.debug(`writing updated manifest: ${opts.manifestPath}`);
  await driver.writeFile(
    opts.manifestPath,
    JSON.stringify(newManifest, null, 2),
  );
  logger.debug("manifest updated");
};
