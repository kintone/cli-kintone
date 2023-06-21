import type { KintoneRestAPIError } from "@kintone/rest-api-client";
import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import type { LocalRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";
import { CliKintoneError } from "../../../../utils/error";
import { parseKintoneRestAPIError } from "../../utils/error";

// Magic number from @kintone/rest-api-client
// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/RecordClient.ts#L17
const UPDATE_RECORDS_LIMIT = 100;

export class UpsertRecordsError extends CliKintoneError {
  readonly detail: string;

  private readonly chunkSize: number = UPDATE_RECORDS_LIMIT;
  private readonly records: LocalRecord[];
  private readonly numOfSuccess: number;
  private readonly numOfSuccessInCurrentChunk: number = 0;
  private readonly numOfTotal: number;
  private readonly recordSchema: RecordSchema;

  /** *
   * @param cause
   * @param currentRecords Records of current chunk divided by cli-kintone.
   * @param currentIndex The index of the first record of the current chunk. It is equal to the number of records that have been already imported.
   * @param recordSchema
   * @param lastSucceededRecord The last record that have been imported successfully in last chunk
   */
  constructor(
    cause: unknown,
    currentRecords: LocalRecord[],
    currentIndex: number,
    recordSchema: RecordSchema,
    lastSucceededRecord?: LocalRecord
  ) {
    const message = "Failed to upsert all records.";
    super(message, cause);

    this.name = "UpsertRecordsError";
    this.records = currentRecords;
    this.recordSchema = recordSchema;

    this.numOfSuccess = currentIndex;
    this.numOfTotal = this.records.length;
    if (this.cause instanceof KintoneAllRecordsError) {
      this.numOfSuccess += this.cause.numOfProcessedRecords;
      this.numOfSuccessInCurrentChunk = this.cause.numOfProcessedRecords;
    }

    if (this.numOfSuccess === 0) {
      this.detail = `No records are processed successfully.`;
    } else {
      const _lastSucceededRecord =
        this.numOfSuccessInCurrentChunk > 0
          ? this.records.at(this.numOfSuccessInCurrentChunk - 1)
          : lastSucceededRecord;
      if (_lastSucceededRecord) {
        this.detail = `Rows from 1 to ${
          (_lastSucceededRecord.metadata.format.lastRowIndex ?? 0) + 1
        } are processed successfully.`;
      } else {
        this.detail = `The first row is processed successfully.`;
      }
    }

    Object.setPrototypeOf(this, UpsertRecordsError.prototype);
  }

  protected _toStringKintoneRestAPIError(error: KintoneRestAPIError): string {
    return parseKintoneRestAPIError(
      error,
      this.chunkSize,
      this.records.slice(this.numOfSuccessInCurrentChunk),
      this.recordSchema
    );
  }
}
