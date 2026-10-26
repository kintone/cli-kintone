import { CliKintoneError } from "../../../../utils/error";

export class PrivateKeyFileExistsError extends CliKintoneError {
  constructor(filePath: string) {
    const message = "Failed to generate a private key.";
    super(message, `File ${filePath} already exists.`);

    this.name = "PrivateKeyFileExistsError";

    Object.setPrototypeOf(this, PrivateKeyFileExistsError.prototype);
  }
}
