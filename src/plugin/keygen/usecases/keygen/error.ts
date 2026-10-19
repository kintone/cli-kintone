import { CliKintoneError } from "../../../../utils/error";

export class PrivateKeyFileExistsError extends CliKintoneError {
  constructor(filePath: string) {
    const message = `File ${filePath} already exists.`;
    super(message, undefined);

    this.name = "PrivateKeyFileExistsError";

    Object.setPrototypeOf(this, PrivateKeyFileExistsError.prototype);
  }
}
