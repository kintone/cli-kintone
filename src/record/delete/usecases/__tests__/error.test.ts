import type { KintoneRecordForDeleteAllParameter } from "../../../../kintone/types";
import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { DeleteAllRecordsError } from "../error";

describe("DeleteAllRecordsError", () => {
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
      numOfProcessedRecords
    );
    const deleteAllRecordsError = new DeleteAllRecordsError(
      kintoneAllRecordsError,
      recordsId
    );
    expect(deleteAllRecordsError.toString()).toBe(
      `Failed to delete all records.\n${numOfProcessedRecords}/${numOfAllRecords} records are deleted successfully.\nAn error occurred while processing records.\n[500] [some code] some error message (some id)`
    );
  });
});

export const buildKintoneRestAPIError = (): KintoneRestAPIError => {
  const errorResponse: KintoneErrorResponse = {
    data: {
      id: "some id",
      code: "some code",
      message: "some error message",
    },
    status: 500,
    statusText: "Internal Server Error",
    headers: {
      "X-Some-Header": "error",
    },
  };
  return new KintoneRestAPIError(errorResponse);
};

export const buildKintoneAllRecordsError = (
  numOfAllRecords: number,
  numOfProcessedRecords: number
): KintoneAllRecordsError => {
  const processedRecordsResult = {
    records: Array(numOfProcessedRecords).map(() => ({})),
  };
  const numOfUnprocessedRecords = numOfAllRecords - numOfProcessedRecords;
  const unprocessedRecords = Array(numOfUnprocessedRecords).map(() => ({}));
  const kintoneRestAPIError = buildKintoneRestAPIError();
  const CHUNK_SIZE = 100;
  return new KintoneAllRecordsError(
    processedRecordsResult,
    unprocessedRecords,
    numOfAllRecords,
    kintoneRestAPIError,
    CHUNK_SIZE
  );
};
