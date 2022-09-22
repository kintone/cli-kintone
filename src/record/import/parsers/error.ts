import { CsvError } from "csv-parse";

export class ParserError extends Error {
  private readonly cause: unknown;

  constructor(cause: unknown) {
    const message = "Failed to parse input";
    super(message);

    this.name = "ParserError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParserError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof CsvError) {
      errorMessage += `${this.cause.code}: ${this.cause.message}`;
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
