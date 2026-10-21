import type { ManifestInterface } from "../../core/manifest/interface";

export type LocalPlugin = {
  readonly filePath: string;
  readonly id: string;
  readonly manifest: ManifestInterface;
  readonly buffer: Buffer;
};

export type LocalPluginRepository = {
  readonly read: () => Promise<LocalPlugin>;
};
