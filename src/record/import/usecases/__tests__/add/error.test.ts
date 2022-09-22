import type { KintoneRecord } from "../../../types/record";
import {
  KintoneAllRecordsError,
  KintoneErrorResponse,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { AddRecordsError } from "../../add/error";

const CHUNK_SIZE = 100;

describe("AddRecordsError", () => {
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
    const upsertRecordsError = new AddRecordsError(
      kintoneAllRecordsError,
      records,
      numOfAlreadyImportedRecords
    );
    expect(upsertRecordsError.toString()).toBe(
      "Failed to add all records.\nRows from 1 to 41 are processed successfully.\nAn error occurred while uploading records.\n[500] [some code] some error message (some id)\n  An error occurred at row 46.\n    Cause: invalid value\n"
    );
  });
});

export const buildKintoneRestAPIError = (
  errorIndex: number,
  numOfProcessedRecords: number,
  numOfAlreadyImportedRecords: number
): KintoneRestAPIError => {
  const errorIndexRelative =
    errorIndex - numOfProcessedRecords - numOfAlreadyImportedRecords;
  const errorResponse: KintoneErrorResponse = {
    data: {
      id: "some id",
      code: "some code",
      message: "some error message",
      errors: {
        [`records[${errorIndexRelative}].number.value`]: {
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

export const buildKintoneAllRecordsError = (
  numOfAllRecords: number,
  numOfProcessedRecords: number,
  numOfAlreadyImportedRecords: number,
  errorIndex: number
): KintoneAllRecordsError => {
  const processedRecordsResult = {
    records: Array(numOfProcessedRecords).map(() => ({})),
  };
  const numOfUnprocessedRecords =
    numOfAllRecords - numOfProcessedRecords - numOfAlreadyImportedRecords;
  const unprocessedRecords = Array(numOfUnprocessedRecords).map(() => ({}));
  const kintoneRestAPIError = buildKintoneRestAPIError(
    errorIndex,
    numOfProcessedRecords,
    numOfAlreadyImportedRecords
  );
  return new KintoneAllRecordsError(
    processedRecordsResult,
    unprocessedRecords,
    numOfAllRecords - numOfAlreadyImportedRecords,
    kintoneRestAPIError,
    CHUNK_SIZE
  );
};
