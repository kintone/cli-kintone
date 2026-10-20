import type {
  DriverInterface,
  ManifestInterface,
  PluginZip,
  PrivateKey,
} from "../../core";

export type LocalPluginProject = {
  readonly manifest: ManifestInterface;
  readonly sources: DriverInterface;
};

export type LocalPluginProjectRepository = {
  readonly read: () => Promise<LocalPluginProject>;
  readonly readPrivateKey: () => Promise<PrivateKey>;
};

export type LocalPluginZipRepository = {
  readonly prepare: () => Promise<void>;
  readonly save: (pluginZip: PluginZip) => Promise<string>;
};
