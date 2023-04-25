import { CliKintoneError } from "../../../utils/error";

export class ValidatorError extends CliKintoneError {
  constructor(cause: unknown) {
    const message = "Failed to delete records";
    super(message, cause);

    this.name = "ValidatorError";

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidatorError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    errorMessage += this.cause + "\n";

    return errorMessage;
  }
}
