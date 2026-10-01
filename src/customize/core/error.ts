import { CliKintoneError } from "../../utils/error";

export class ManifestValidationError extends CliKintoneError {
  constructor(problems: string[]) {
    const message = "Failed to load customize-manifest.json";
    super(message, problems.map((problem) => `  ${problem}`).join("\n"));

    this.name = "ManifestValidationError";

    Object.setPrototypeOf(this, ManifestValidationError.prototype);
  }
}
