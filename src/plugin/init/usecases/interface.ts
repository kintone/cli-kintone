import type { ManifestPatch } from "../utils/template/manifest";
import type { PackageJsonPatch } from "../utils/template/pacakge-json";

export type PluginProjectSettings = {
  readonly manifestPatch: ManifestPatch;
  readonly packageJsonPatch: PackageJsonPatch;
};

export type LocalPluginProjectRepository = {
  /** Throws PluginProjectPathExistsError without creating anything when anything, such as a directory or a file, exists at the path. */
  readonly create: (settings: PluginProjectSettings) => Promise<void>;
  readonly installDependencies: () => Promise<void>;
  readonly generatePrivateKey: () => Promise<void>;
  /**
   * Removes only what create made, so that nothing that existed before is removed.
   * Logs a failure at the debug level instead of throwing it, so that the error that caused the removal is reported.
   */
  readonly remove: () => Promise<void>;
};
