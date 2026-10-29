import fs from "fs/promises";
import path from "path";
import type {
  LocalPluginProjectRepository,
  PluginProjectSettings,
} from "../usecases/interface";
import { PluginProjectPathExistsError } from "../usecases/init/error";
import { setupTemplate } from "../utils/template";
import { installDependencies } from "../utils/deps";
import { runKeygen } from "../utils/keygen";
import { exists } from "../../../utils/file";
import { logger } from "../../../utils/log";

export class LocalPluginProjectRepositoryFromTemplate implements LocalPluginProjectRepository {
  private readonly directory: string;
  private readonly templateName: string;
  // The top of the directories that create() made, which is the parent of the directory when the parent did not exist.
  private createdPath: string | undefined;

  constructor(options: { directory: string; templateName: string }) {
    // Without normalizing, "missing/../my-plugin" passes the existence check even when my-plugin exists,
    // and fs.mkdir returns "missing", which is not an ancestor of the directory.
    this.directory = path.normalize(options.directory);
    this.templateName = options.templateName;
  }

  async create(settings: PluginProjectSettings) {
    logger.debug(`template: ${this.templateName}`);
    if (await exists(this.directory)) {
      throw new PluginProjectPathExistsError(this.directory);
    }

    this.createdPath = await fs.mkdir(this.directory, { recursive: true });
    await setupTemplate({
      outputDir: this.directory,
      templateName: this.templateName,
      manifestPatch: settings.manifestPatch,
      packageJsonPatch: settings.packageJsonPatch,
    });
  }

  async installDependencies() {
    installDependencies(this.directory);
  }

  async generatePrivateKey() {
    runKeygen(this.directory);
  }

  async remove() {
    if (this.createdPath === undefined) {
      return;
    }

    const createdPath = this.createdPath;
    await fs
      .rm(createdPath, { recursive: true, force: true })
      .catch((removeError: unknown) => {
        logger.debug(`failed to remove ${createdPath}: ${String(removeError)}`);
      });
  }
}
