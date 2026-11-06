import { CliKintoneError } from "../../../../utils/error";

export class PluginProjectPathExistsError extends CliKintoneError {
  constructor(directory: string) {
    super(
      "Could not create a plug-in project.",
      `${directory} already exists. Choose a different directory`,
    );

    this.name = "PluginProjectPathExistsError";

    Object.setPrototypeOf(this, PluginProjectPathExistsError.prototype);
  }
}

export class PluginProjectCreationError extends CliKintoneError {
  constructor(cause: unknown) {
    super("Could not create a plug-in project.", cause);

    this.name = "PluginProjectCreationError";

    Object.setPrototypeOf(this, PluginProjectCreationError.prototype);
  }
}
