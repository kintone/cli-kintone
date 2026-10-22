import { CliKintoneError } from "../../../../utils/error";

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
