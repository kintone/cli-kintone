import { KintoneAllRecordsError } from "@kintone/rest-api-client";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L16
const ADD_RECORDS_LIMIT = 100;

export class AddRecordsError extends Error {
  cause: unknown;

  constructor(cause: unknown) {
    const message = "Failed to add all records.";
    super(message);

    this.name = "AddRecordsError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AddRecordsError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof KintoneAllRecordsError) {
      errorMessage += "An error occured while uploading records.\n";

      const totalMatch = this.cause.message.match(
        /(?<numOfSuccess>\d+)\/(?<numOfTotal>\d+) records are processed successfully/
      );
      const numOfSuccess = Number(totalMatch?.groups?.numOfSuccess);
      const numOfTotal = Number(totalMatch?.groups?.numOfTotal);
      errorMessage += `${numOfSuccess}/${numOfTotal} records are processed successfully.\n`;
      const errors = this.cause.error.errors as {
        [k: string]: { messages: string[] };
      };
      const orderedErrors = Object.entries(errors).sort((error1, error2) => {
        const index1 = error1[0].match(/records\[(\d+)\]/)?.at(1);
        const index2 = error2[0].match(/records\[(\d+)\]/)?.at(1);
        if (index1 === undefined) {
          return 1;
        }
        if (index2 === undefined) {
          return -1;
        }
        return Number(index1) - Number(index2);
      });
      for (const [key, value] of orderedErrors) {
        const bulkRequestIndex = this.cause.error.bulkRequestIndex ?? 0;
        const indexMatch = key.match(/records\[(\d+)\]/);
        const index =
          Number(indexMatch?.at(1)) + bulkRequestIndex * ADD_RECORDS_LIMIT;
        errorMessage += `  An error occurred at records[${index}].\n`;
        for (const message of value.messages) {
          errorMessage += `    Cause: ${message}\n`;
        }
      }
    } else if (this.cause instanceof AddRecordsError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
