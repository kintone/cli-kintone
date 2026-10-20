import { CliKintoneError } from "../../../../utils/error";

const message = "Failed to pack the plugin.";

export class PluginManifestFileNotFoundError extends CliKintoneError {
  constructor(filePath: string) {
    super(message, `Manifest file not found: ${filePath}`);

    this.name = "PluginManifestFileNotFoundError";

    Object.setPrototypeOf(this, PluginManifestFileNotFoundError.prototype);
  }
}

export class PrivateKeyFileNotFoundError extends CliKintoneError {
  constructor(filePath: string) {
    super(message, `Private key file not found: ${filePath}`);

    this.name = "PrivateKeyFileNotFoundError";

    Object.setPrototypeOf(this, PrivateKeyFileNotFoundError.prototype);
  }
}

export class PluginManifestValidationError extends CliKintoneError {
  constructor(problems: string[]) {
    super(
      "Invalid manifest.json:",
      problems.map((problem) => `- ${problem}`).join("\n"),
    );

    this.name = "PluginManifestValidationError";

    Object.setPrototypeOf(this, PluginManifestValidationError.prototype);
  }
}
