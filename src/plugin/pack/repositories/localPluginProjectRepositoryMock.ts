import type { PrivateKey } from "../../core";
import type {
  LocalPluginProject,
  LocalPluginProjectRepository,
} from "../usecases/interface";

export class LocalPluginProjectRepositoryMock implements LocalPluginProjectRepository {
  private readonly project: LocalPluginProject;
  private readonly privateKey: PrivateKey;

  constructor(project: LocalPluginProject, privateKey: PrivateKey) {
    this.project = project;
    this.privateKey = privateKey;
  }

  async read() {
    return this.project;
  }

  async readPrivateKey() {
    return this.privateKey;
  }
}
