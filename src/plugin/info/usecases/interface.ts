import type { ManifestInterface } from "../../core/manifest/interface";

export type LocalPlugin = {
  readonly id: string;
  readonly manifest: ManifestInterface;
};

export type LocalPluginRepository = {
  readonly read: () => Promise<LocalPlugin>;
};
