import { CliKintoneError } from "../../../utils/error";

export class RepositoryError extends CliKintoneError {
  constructor(cause: unknown) {
    const message =
      "An error occurred while exporting records to the data sink";
    super(message, cause);

    this.name = "RepositoryError";
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
