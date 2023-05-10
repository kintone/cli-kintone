import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../../../error";
import type { LocalRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";
import { ErrorParser } from "../../utils/error";
import { CliKintoneError } from "../../../../utils/error";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L16
const ADD_RECORDS_LIMIT = 100;

export class AddRecordsError extends CliKintoneError {
  readonly detail: string;

  private readonly chunkSize: number = ADD_RECORDS_LIMIT;
  private readonly records: LocalRecord[];
  private readonly numOfSuccess: number;
  private readonly numOfTotal: number;
  private readonly recordSchema: RecordSchema;

  constructor(
    cause: unknown,
    records: LocalRecord[],
    currentIndex: number,
    recordSchema: RecordSchema
  ) {
    const message = "Failed to add all records.";
    super(message, cause);

    this.name = "AddRecordsError";
    this.records = records;
    this.recordSchema = recordSchema;

    this.numOfSuccess = currentIndex;
    this.numOfTotal = this.records.length;
    if (this.cause instanceof KintoneAllRecordsError) {
      this.numOfSuccess += this.cause.numOfProcessedRecords;
    }

    if (this.numOfSuccess === 0) {
      this.detail = `No records are processed successfully.`;
    } else {
      const lastSucceededRecord = this.records[this.numOfSuccess - 1];
      this.detail = `Rows from 1 to ${
        lastSucceededRecord.metadata.format.lastRowIndex + 1
      } are processed successfully.`;
    }

    Object.setPrototypeOf(this, AddRecordsError.prototype);
  }

  protected _toStringCause(): string {
    if (this.cause instanceof KintoneAllRecordsError) {
      return kintoneAllRecordsErrorToString(
        new ErrorParser(
          this.cause,
          this.chunkSize,
          this.records,
          this.numOfSuccess,
          this.recordSchema
        )
      );
    }
    return super._toStringCause();
  }
}
