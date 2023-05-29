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
    // 10000件のレコードをインポートします = numOfAllRecords
    // cli-kintoneのaddRecords()で2000件ずつrest-api-clientに送信
    // rest-api-clientはレコードを100件ずつkintoneに送信
    // 全体の5008件目でエラーが発生した = errorIndex
    // 先頭の4000件はすでにインポート済み（2000*2） = numOfAlreadyImportedRecords
    // 処理中の2000件のうち、1000件はインポート済み（100*10） = numOfProcessedRecords
    //
    // 60件のレコードをインポートします = numOfAllRecords
    // cli-kintoneのaddRecords()でn件ずつrest-api-clientに送信
    // rest-api-clientはレコードをm件ずつkintoneに送信
    // 全体の44件目でエラーが発生した = errorIndex CSV上の46行目
    // 先頭の10件はすでにインポート済み = numOfAlreadyImportedRecords
    // 処理中のn件のうち、30件はインポート済み = numOfProcessedRecords
    const numOfAllRecords = 60; // インポート処理対象のレコード全件 60件 CSV上の1行目-61行目
    const numOfAlreadyImportedRecords = 10; // cli-kintone内で処理に成功したレコードの件数 10件
    const numOfProcessedRecords = 30; // 現在処理中のチャンクのうち、処理に成功したレコードの件数 30件
    const errorIndex = 44; // インポート対象のレコード全件のうち、エラーが発生したレコードのインデックス
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
      numOfAlreadyImportedRecords,
      errorIndex
    );
    const upsertRecordsError = new AddRecordsError(
      kintoneAllRecordsError,
      records,
      numOfAlreadyImportedRecords,
      schema
    );
    expect(upsertRecordsError.toString()).toBe(
      "Failed to add all records.\nRows from 1 to 41 are processed successfully.\nAn error occurred while processing records.\n[500] [some code] some error message (some id)\n  An error occurred on number at row 46.\n    Cause: invalid value\n"
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
