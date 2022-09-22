import type { KintoneRecord } from "../../../types/record";
import { UpsertRecordsError } from "../../upsert/error";
import { buildKintoneAllRecordsError } from "../add/error.test";

describe("UpsertRecordsError", () => {
  it("should return error message", () => {
    const numOfAllRecords = 60;
    const numOfAlreadyImportedRecords = 10;
    const numOfProcessedRecords = 30;
    const errorIndex = 44;
    const records: KintoneRecord[] = [...Array(numOfAllRecords).keys()].map(
      (index) => ({
        data: {},
        metadata: {
          format: {
            type: "csv",
            firstRowIndex: index + 1,
            lastRowIndex: index + 1,
          },
        },
      })
    );
    const kintoneAllRecordsError = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
      numOfAlreadyImportedRecords,
      errorIndex
    );
    const upsertRecordsError = new UpsertRecordsError(
      kintoneAllRecordsError,
      records,
      numOfAlreadyImportedRecords
    );
    expect(upsertRecordsError.toString()).toBe(
      "Failed to upsert all records.\nRows from 1 to 40 are processed successfully.\nAn error occurred while uploading records.\n[500] [some code] some error message (some id)\n  An error occurred at row 45.\n    Cause: invalid value\n"
    );
  });
});
