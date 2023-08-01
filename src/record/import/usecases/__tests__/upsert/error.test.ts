import type { LocalRecord } from "../../../types/record";
import { UpsertRecordsError } from "../../upsert/error";
import { buildKintoneAllRecordsError } from "../add/error.test";
import type { RecordSchema } from "../../../types/schema";

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

describe("UpsertRecordsError", () => {
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
    const upsertRecordsError = new UpsertRecordsError(
      kintoneAllRecordsError,
      records.slice(numOfAlreadyImportedRecords),
      numOfAlreadyImportedRecords,
      schema,
    );
    expect(upsertRecordsError.toString()).toBe(
      "Failed to upsert all records.\nRows from 1 to 41 are processed successfully.\nAn error occurred while processing records.\n[500] [some code] some error message (some id)\n  An error occurred on number at row 46.\n    Cause: invalid value\n",
    );
  });
});
