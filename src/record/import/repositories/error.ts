import { CliKintoneError } from "../../../utils/error";

export class RepositoryError extends CliKintoneError {
  constructor(cause: unknown) {
    const message =
      "An error occurred while loading records from the data source";
    super(message, cause);

    this.name = "RepositoryError";
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
