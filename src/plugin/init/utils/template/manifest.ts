import { LocalFSDriver } from "../../../core/driver";

// NOTE: this object has only fields for update
export type ManifestJsonObjectForUpdate = {
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
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
  };
};

export const updateManifestsForAnswers = async (opts: {
  manifestPath: string;
  answers: ManifestJsonObjectForUpdate;
}) => {
  const driver = new LocalFSDriver();
  const manifestJson = await driver.readFile(opts.manifestPath, "utf-8");
  const manifest = JSON.parse(manifestJson);
  const newManifest = { ...manifest, ...opts.answers };
  await driver.writeFile(
    opts.manifestPath,
    JSON.stringify(newManifest, null, 2),
  );
};
