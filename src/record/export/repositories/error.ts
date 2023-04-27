import { CliKintoneError } from "../../../utils/error";

export class RepositoryError extends CliKintoneError {
  constructor(cause: unknown) {
    const message =
      "An error occurred while exporting records to the data sink";
    super(message, cause);

    this.name = "RepositoryError";
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
