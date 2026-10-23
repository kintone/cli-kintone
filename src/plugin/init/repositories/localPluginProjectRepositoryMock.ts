import type {
  LocalPluginProjectRepository,
  PluginProjectSettings,
} from "../usecases/interface";
import { PluginDirectoryExistsError } from "../usecases/init/error";

type Step = "create" | "installDependencies" | "generatePrivateKey" | "remove";

export class LocalPluginProjectRepositoryMock implements LocalPluginProjectRepository {
  settings: PluginProjectSettings | undefined;
  readonly steps: Step[] = [];

  private readonly directory: string;
  private readonly exists: boolean;

  constructor(options: { directory: string; exists?: boolean }) {
    this.directory = options.directory;
    this.exists = options.exists ?? false;
  }

  async create(settings: PluginProjectSettings) {
    if (this.exists) {
      throw new PluginDirectoryExistsError(this.directory);
    }

    this.steps.push("create");
    this.settings = settings;
  }

  async installDependencies() {
    this.steps.push("installDependencies");
  }

  async generatePrivateKey() {
    this.steps.push("generatePrivateKey");
  }

  async remove() {
    this.steps.push("remove");
    this.settings = undefined;
  }
}
