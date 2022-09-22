import type { KintoneRecord } from "../../types/record";
import {
  KintoneAllRecordsError,
  KintoneErrorResponse,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../error";

const CHUNK_SIZE = 100;

const buildKintoneRestAPIError = (errorIndex: number): KintoneRestAPIError => {
  const errorResponse: KintoneErrorResponse = {
    data: {
      id: "some id",
      code: "some code",
      message: "some error message",
      errors: {
        [`records[${errorIndex}].number.value`]: {
          messages: ["invalid value"],
        },
      },
    },
    status: 500,
    statusText: "Internal Server Error",
    headers: {
      "X-Some-Header": "error",
    },
  };
  return new KintoneRestAPIError(errorResponse);
};

const buildKintoneAllRecordsError = (
  numOfAllRecords: number,
  numOfProcessedRecords: number,
  errorIndex: number
): KintoneAllRecordsError => {
  const processedRecordsResult = {
    records: Array(numOfProcessedRecords).map(() => ({})),
  };
  const unprocessedRecords = Array(numOfAllRecords - numOfProcessedRecords).map(
    () => ({})
  );
  const kintoneRestAPIError = buildKintoneRestAPIError(
    errorIndex - numOfProcessedRecords
  );
  return new KintoneAllRecordsError(
    processedRecordsResult,
    unprocessedRecords,
    numOfAllRecords,
    kintoneRestAPIError,
    CHUNK_SIZE
  );
};

describe("kintoneAllRecordsErrorToString", () => {
  it("should return error message", () => {
    const numOfAllRecords = 60;
    const numOfProcessedRecords = 30;
    const errorIndex = 34;
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
    const error = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
      errorIndex
    );
    expect(kintoneAllRecordsErrorToString(error, CHUNK_SIZE, records, 0)).toBe(
      "An error occurred while uploading records.\nRows from 1 to 30 are processed successfully.\n[500] [some code] some error message (some id)\n  An error occurred at row 35.\n    Cause: invalid value\n"
    );
  });
});
