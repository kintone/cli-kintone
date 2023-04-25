import { CsvError } from "csv-parse";
import { CliKintoneError } from "../../../utils/error";

export class ParserError extends CliKintoneError {
  constructor(cause: unknown) {
    const message = "Failed to parse input";
    super(message, cause);
    this.name = "ParserError";
    Object.setPrototypeOf(this, ParserError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof CsvError) {
      errorMessage += `${this.cause.code}: ${this.cause.message}\n`;
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
