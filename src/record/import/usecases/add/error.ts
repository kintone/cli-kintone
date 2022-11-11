import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../../utils/error";
import type { KintoneRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L16
const ADD_RECORDS_LIMIT = 100;

export class AddRecordsError extends Error {
  private readonly cause: unknown;
  private readonly chunkSize: number = ADD_RECORDS_LIMIT;
  private readonly records: KintoneRecord[];
  private readonly numOfSuccess: number;
  private readonly numOfTotal: number;
  private readonly recordSchema: RecordSchema;

  constructor(
    cause: unknown,
    records: KintoneRecord[],
    currentIndex: number,
    recordSchema: RecordSchema
  ) {
    const message = "Failed to add all records.";
    super(message);

    this.name = "AddRecordsError";
    this.message = message;
    this.cause = cause;
    this.records = records;
    this.recordSchema = recordSchema;

    this.numOfSuccess = currentIndex;
    this.numOfTotal = this.records.length;
    if (this.cause instanceof KintoneAllRecordsError) {
      this.numOfSuccess += this.cause.numOfProcessedRecords;
    }

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AddRecordsError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";

    if (this.numOfSuccess === 0) {
      errorMessage += `No records are processed successfully.\n`;
    } else {
      const lastSucceededRecord = this.records[this.numOfSuccess - 1];
      errorMessage += `Rows from 1 to ${
        lastSucceededRecord.metadata.format.lastRowIndex + 1
      } are processed successfully.\n`;
    }

    if (this.cause instanceof KintoneAllRecordsError) {
      errorMessage += kintoneAllRecordsErrorToString(
        this.cause,
        this.chunkSize,
        this.records,
        this.numOfSuccess,
        this.recordSchema
      );
    } else if (this.cause instanceof AddRecordsError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
