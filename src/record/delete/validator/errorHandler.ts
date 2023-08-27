import type { RecordNumber } from "../types/field";
import { ValidatorError } from "./error";

export class ErrorHandler {
  private readonly invalidValue: RecordNumber[];
  private readonly notExists: RecordNumber[];
  private readonly duplicated: RecordNumber[];

  constructor() {
    this.invalidValue = [];
    this.notExists = [];
    this.duplicated = [];
  }

  addInvalidValueError = (recordNumber: RecordNumber) =>
    this.invalidValue.push(recordNumber);
  addNotExistsError = (recordNumber: RecordNumber) =>
    this.notExists.push(recordNumber);
  addDuplicatedError = (recordNumber: RecordNumber) =>
    this.duplicated.push(recordNumber);

  hasError = (): boolean =>
    this.invalidValue.length > 0 ||
    this.notExists.length > 0 ||
    this.duplicated.length > 0;

  generateError = () => {
    let errorMessage = "";

    if (this.invalidValue.length > 0) {
      errorMessage += `  Invalid record number. ID: ${this.generateReportedId(
        this.invalidValue,
      )}\n`;
    }

    if (this.notExists.length > 0) {
      errorMessage += `  Not exists record number. ID: ${this.generateReportedId(
        this.notExists,
      )}\n`;
    }

    if (this.duplicated.length > 0) {
      errorMessage += `  Duplicated record number. ID: ${this.generateReportedId(
        this.duplicated,
      )}\n`;
    }

    return new ValidatorError(errorMessage);
  };

  generateReportedId = (recordNumbers: RecordNumber[]): string => {
    return recordNumbers
      .map((recordNumber) => recordNumber.value || "<empty_string>")
      .join(", ");
  };
}
