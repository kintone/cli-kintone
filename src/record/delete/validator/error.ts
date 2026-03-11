import { CliKintoneError } from "../../../utils/error.js";

export class ValidatorError extends CliKintoneError {
  constructor(cause: unknown) {
    const message = "Failed to delete records";
    super(message, cause);

    this.name = "ValidatorError";

    Object.setPrototypeOf(this, ValidatorError.prototype);
  }
}
