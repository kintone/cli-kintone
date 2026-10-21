import { CliKintoneError } from "../../../../utils/error";

const message = "Failed to upload the plugin.";

export class PluginFileNotFoundError extends CliKintoneError {
  constructor(filePath: string) {
    super(message, `Plugin file not found: ${filePath}`);

    this.name = "PluginFileNotFoundError";

    Object.setPrototypeOf(this, PluginFileNotFoundError.prototype);
  }
}

export class PluginUploadRequestError extends CliKintoneError {
  constructor(cause: unknown) {
    super(message, cause);

    this.name = "PluginUploadRequestError";

    Object.setPrototypeOf(this, PluginUploadRequestError.prototype);
  }
}
