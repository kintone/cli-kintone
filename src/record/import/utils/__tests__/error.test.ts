import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import { KintoneRestAPIError } from "@kintone/rest-api-client";
import type { RecordSchema } from "../../types/schema";
import type { LocalRecord } from "../../types/record";
import { parseKintoneRestAPIError } from "../error";

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

describe("parseKintoneRestAPIError", () => {
  it("should return parsed string", () => {
    // All records to be imported
    const numOfAllRecords = 200;
    // Records already imported, chunked by cli-kintone
    const numOfAlreadyImportedRecords = 100;
    // Records already imported, chunked by rest-api-client
    // https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/errorHandling.md#kintoneallrecordserror
    const numOfProcessedRecords = 30;
    const errorIndex = 135;
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
      }),
    );
    const kintoneRestAPIError = buildKintoneRestAPIError(
      errorIndex,
      errorFieldCode,
      numOfProcessedRecords,
      numOfAlreadyImportedRecords,
    );
    const errorMessage = parseKintoneRestAPIError(
      kintoneRestAPIError,
      CHUNK_SIZE,
      records.slice(numOfAlreadyImportedRecords + numOfProcessedRecords),
      schema,
    );
    expect(errorMessage).toBe(
      `[500] [some code] some error message (some id)\n  An error occurred on ${errorFieldCode} at row ${errorRowIndex}.\n    Cause: invalid value\n`,
    );
  });
});

export const buildKintoneRestAPIError = (
  errorIndex: number,
  errorFieldCode: string,
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
