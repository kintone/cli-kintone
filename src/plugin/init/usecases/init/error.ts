import { CliKintoneError } from "../../../../utils/error";

export class PluginDirectoryExistsError extends CliKintoneError {
  constructor(directory: string) {
    super(
      "Could not create a plug-in project.",
      `${directory} already exists. Choose a different directory`,
    );

    this.name = "PluginDirectoryExistsError";

    Object.setPrototypeOf(this, PluginDirectoryExistsError.prototype);
  }
}

export class PluginProjectCreationError extends CliKintoneError {
  constructor(cause: unknown) {
    super("Could not create a plug-in project.", cause);

    this.name = "PluginProjectCreationError";

    Object.setPrototypeOf(this, PluginProjectCreationError.prototype);
  }
}
