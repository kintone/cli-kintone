import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../../utils/error";
import { KintoneRecord } from "../../types/record";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L16
const ADD_RECORDS_LIMIT = 100;

export class AddRecordsError extends Error {
  private readonly cause: unknown;
  private readonly chunkSize: number = ADD_RECORDS_LIMIT;
  private readonly records: KintoneRecord[];
  private readonly currentIndex: number;

  constructor(cause: unknown, records: KintoneRecord[], currentIndex: number) {
    const message = "Failed to add all records.";
    super(message);

    this.name = "AddRecordsError";
    this.message = message;
    this.cause = cause;
    this.records = records;
    this.currentIndex = currentIndex;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AddRecordsError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof KintoneAllRecordsError) {
      errorMessage += kintoneAllRecordsErrorToString(
        this.cause,
        this.chunkSize,
        this.records,
        this.currentIndex
      );
    } else if (this.cause instanceof AddRecordsError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
