import type { LocalRecord } from "../../types/record";
import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../error";
import type { RecordSchema } from "../../types/schema";

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

describe("kintoneAllRecordsErrorToString", () => {
  it("should return error message", () => {
    const numOfAllRecords = 60;
    const numOfProcessedRecords = 40;
    const errorIndex = 44;
    const errorFieldCode = "number";
    const errorRowIndex = errorIndex + 2;
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
      })
    );
    const kintoneAllRecordsError = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
      errorIndex,
      errorFieldCode
    );
    const errorMessage = kintoneAllRecordsErrorToString(
      kintoneAllRecordsError,
      CHUNK_SIZE,
      records,
      numOfProcessedRecords,
      schema
    );
    expect(errorMessage).toBe(
      `An error occurred while uploading records.\n[500] [some code] some error message (some id)\n  An error occurred on ${errorFieldCode} at row ${errorRowIndex}.\n    Cause: invalid value\n`
    );
  });
});

export const buildKintoneRestAPIError = (
  errorIndex: number,
  errorFieldCode: string,
  numOfProcessedRecords: number
): KintoneRestAPIError => {
  const errorIndexRelative = errorIndex - numOfProcessedRecords;
  const errorResponse: KintoneErrorResponse = {
    data: {
      id: "some id",
      code: "some code",
      message: "some error message",
      errors: {
        [`records[${errorIndexRelative}].${errorFieldCode}.value`]: {
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
  errorIndex: number,
  errorFieldCode: string
): KintoneAllRecordsError => {
  const processedRecordsResult = {
    records: Array(numOfProcessedRecords).map(() => ({})),
  };
  const numOfUnprocessedRecords = numOfAllRecords - numOfProcessedRecords;
  const unprocessedRecords = Array(numOfUnprocessedRecords).map(() => ({}));
  const kintoneRestAPIError = buildKintoneRestAPIError(
    errorIndex,
    errorFieldCode,
    numOfProcessedRecords
  );
  return new KintoneAllRecordsError(
    processedRecordsResult,
    unprocessedRecords,
    numOfAllRecords,
    kintoneRestAPIError,
    CHUNK_SIZE
  );
};
