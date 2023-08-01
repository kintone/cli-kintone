import type { LocalRecord } from "../../../types/record";
import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { AddRecordsError } from "../../add/error";
import type { RecordSchema } from "../../../types/schema";

const CHUNK_SIZE = 100;
const schema: RecordSchema = {
  fields: [
    {
      type: "NUMBER",
      code: "number",
      label: "number",
      noLabel: false,
      required: true,
      minValue: "",
      maxValue: "",
      digit: false,
      unique: true,
      defaultValue: "",
      displayScale: "",
      unit: "",
      unitPosition: "BEFORE",
    },
  ],
};

describe("AddRecordsError", () => {
  it("should return error message", () => {
    const numOfAllRecords = 60;
    const numOfAlreadyImportedRecords = 10;
    const numOfProcessedRecords = 30;
    const errorIndex = 44;
    const records: LocalRecord[] = [...Array(numOfAllRecords).keys()].map(
      (index) => ({
        data: {},
        metadata: {
          recordIndex: index,
          format: {
            type: "csv",
            firstRowIndex: index + 1,
            lastRowIndex: index + 1,
          },
        },
      }),
    );
    const kintoneAllRecordsError = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
      numOfAlreadyImportedRecords,
      errorIndex,
    );
    const upsertRecordsError = new AddRecordsError(
      kintoneAllRecordsError,
      records.slice(numOfAlreadyImportedRecords),
      numOfAlreadyImportedRecords,
      schema,
    );
    expect(upsertRecordsError.toString()).toBe(
      "Failed to add all records.\nRows from 1 to 41 are processed successfully.\nAn error occurred while processing records.\n[500] [some code] some error message (some id)\n  An error occurred on number at row 46.\n    Cause: invalid value\n",
    );
  });
});

export const buildKintoneRestAPIError = (
  errorIndex: number,
  numOfProcessedRecords: number,
  numOfAlreadyImportedRecords: number,
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
  errorIndex: number,
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
    numOfAlreadyImportedRecords,
  );
  return new KintoneAllRecordsError(
    processedRecordsResult,
    unprocessedRecords,
    numOfAllRecords - numOfAlreadyImportedRecords,
    kintoneRestAPIError,
    CHUNK_SIZE,
  );
};
