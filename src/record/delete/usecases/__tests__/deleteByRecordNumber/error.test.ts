import type { KintoneRecordForDeleteAllParameter } from "../../../../../kintone/types.js";
import { DeleteSpecifiedRecordsError } from "../../deleteByRecordNumber/error.js";
import { buildKintoneAllRecordsError } from "../deleteAll/error.test.js";

describe("DeleteRecordsError", () => {
  it("should return error message", () => {
    const numOfAllRecords = 2022;
    const numOfProcessedRecords = 2000;
    const recordsId: KintoneRecordForDeleteAllParameter[] = [
      ...Array(numOfAllRecords).keys(),
    ].map((index) => ({
      id: index,
    }));
    const kintoneAllRecordsError = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
    );
    const deleteSpecifiedRecordsError = new DeleteSpecifiedRecordsError(
      kintoneAllRecordsError,
      recordsId,
    );
    expect(deleteSpecifiedRecordsError.toString()).toBe(
      `Failed to delete records.\n${numOfProcessedRecords}/${numOfAllRecords} records are deleted successfully.\nAn error occurred while processing records.\n[500] [some code] some error message (some id)\n`,
    );
  });
});
