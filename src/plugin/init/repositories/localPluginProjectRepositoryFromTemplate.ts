import fs from "fs/promises";
import type {
  LocalPluginProjectRepository,
  PluginProjectSettings,
} from "../usecases/interface";
import { PluginDirectoryExistsError } from "../usecases/init/error";
import { setupTemplate } from "../utils/template";
import { installDependencies } from "../utils/deps";
import { runKeygen } from "../utils/keygen";
import { isDirectory } from "../../../utils/file";
import { logger } from "../../../utils/log";

export class LocalPluginProjectRepositoryFromTemplate implements LocalPluginProjectRepository {
  private readonly directory: string;
  private readonly templateName: string;

  constructor(options: { directory: string; templateName: string }) {
    this.directory = options.directory;
    this.templateName = options.templateName;
  }

  async create(settings: PluginProjectSettings) {
    logger.debug(`template: ${this.templateName}`);
    if (await isDirectory(this.directory)) {
      throw new PluginDirectoryExistsError(this.directory);
    }

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
    await fs
      .rm(this.directory, { recursive: true, force: true })
      .catch((removeError: unknown) => {
        logger.debug(
          `failed to remove ${this.directory}: ${String(removeError)}`,
        );
      });
  }
}
