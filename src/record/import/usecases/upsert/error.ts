import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../../utils/error";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L17
const UPDATE_RECORDS_LIMIT = 100;

export class UpsertRecordsError extends Error {
  cause: unknown;
  chunkSize: number = UPDATE_RECORDS_LIMIT;

  constructor(cause: unknown) {
    const message = "Failed to upsert all records.";
    super(message);

    this.name = "UpsertRecordsError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpsertRecordsError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof KintoneAllRecordsError) {
      errorMessage += kintoneAllRecordsErrorToString(
        this.cause,
        this.chunkSize
      );
    } else if (this.cause instanceof UpsertRecordsError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
