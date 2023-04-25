import { ParserError } from "./parsers/error";
import { CliKintoneError } from "../../../utils/error";

export class RepositoryError extends CliKintoneError {
  constructor(cause: unknown) {
    const message =
      "An error occurred while loading records from the data source";
    super(message, cause);

    this.name = "RepositoryError";
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof ParserError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
