import { KintoneAllRecordsError } from "@kintone/rest-api-client";
import type { KintoneRecordForDeleteAllParameter } from "../../../../kintone/types";
import { ErrorParser } from "../../utils/error";
import { CliKintoneError } from "../../../../utils/error";

export class DeleteSpecifiedRecordsError extends CliKintoneError {
  readonly detail: string;

  private readonly records: KintoneRecordForDeleteAllParameter[];
  private readonly numOfSuccess: number;
  private readonly numOfTotal: number;

  constructor(cause: unknown, records: KintoneRecordForDeleteAllParameter[]) {
    const message = "Failed to delete records.";
    super(message, cause);

    this.name = "DeleteSpecifiedRecordsError";
    this.records = records;
    this.numOfTotal = this.records.length;
    this.numOfSuccess = 0;
    if (this.cause instanceof KintoneAllRecordsError) {
      this.numOfSuccess = this.cause.numOfProcessedRecords;
    }

    if (this.numOfSuccess === 0) {
      this.detail = `No records are deleted.`;
    } else {
      this.detail = `${this.numOfSuccess}/${this.numOfTotal} records are deleted successfully.`;
    }

    Object.setPrototypeOf(this, DeleteSpecifiedRecordsError.prototype);
  }

  protected _toStringKintoneAllRecordsError(
    error: KintoneAllRecordsError
  ): string {
    let errorMessage = "An error occurred while processing records.\n";
    const errorParser = new ErrorParser(error);

    errorMessage += errorParser.toString();

    return errorMessage;
  }
}
