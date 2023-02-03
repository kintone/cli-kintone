import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import type { KintoneRecordForDeleteAllParameter } from "../../../../kintone/types";
import { kintoneAllRecordsErrorToString } from "../../../error";
import { ErrorParser } from "../../utils/error";

export class DeleteRecordsError extends Error {
  private readonly cause: unknown;
  private readonly records: KintoneRecordForDeleteAllParameter[];
  private readonly numOfSuccess: number;
  private readonly numOfTotal: number;

  constructor(cause: unknown, records: KintoneRecordForDeleteAllParameter[]) {
    const message = "Failed to delete records.";
    super(message);

    this.name = "DeleteRecordsError";
    this.message = message;
    this.cause = cause;
    this.records = records;
    this.numOfTotal = this.records.length;
    this.numOfSuccess = 0;
    if (this.cause instanceof KintoneAllRecordsError) {
      this.numOfSuccess = this.cause.numOfProcessedRecords;
    }

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DeleteRecordsError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";

    if (this.numOfSuccess === 0) {
      errorMessage += `No records are deleted.\n`;
    } else {
      errorMessage += `${this.numOfSuccess}/${this.numOfTotal} records are deleted successfully.\n`;
    }

    if (this.cause instanceof KintoneAllRecordsError) {
      errorMessage += kintoneAllRecordsErrorToString(
        new ErrorParser(this.cause)
      );
    } else if (this.cause instanceof DeleteRecordsError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
