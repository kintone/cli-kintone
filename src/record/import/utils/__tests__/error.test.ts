import type { LocalRecord } from "../../types/record";
import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { kintoneAllRecordsErrorToString } from "../../../error";
import { ErrorParser } from "../error";
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
