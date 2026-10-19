import { CliKintoneError } from "../../../../utils/error";

export class PrivateKeyFileExistsError extends CliKintoneError {
  constructor(filePath: string) {
    // Keeps the output "Error: File <path> already exists.": toString() prints an Error cause with the "Error: " prefix.
    super("", new Error(`File ${filePath} already exists.`));

    this.name = "PrivateKeyFileExistsError";

    Object.setPrototypeOf(this, PrivateKeyFileExistsError.prototype);
  }
}
