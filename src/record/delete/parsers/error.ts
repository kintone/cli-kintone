import { CsvError } from "csv-parse";
import { CliKintoneError } from "../../../utils/error";

export class ParserError extends CliKintoneError {
  constructor(cause: unknown) {
    const message = "Failed to parse input";
    super(message, cause);
    this.name = "ParserError";
    Object.setPrototypeOf(this, ParserError.prototype);
  }

  protected _toStringCause(): string {
    if (this.cause instanceof CsvError) {
      return `${this.cause.code}: ${this.cause.message}\n`;
    }
    return super._toStringCause();
  }
}
