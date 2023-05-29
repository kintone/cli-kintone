import type { KintoneErrorResponse } from "@kintone/rest-api-client";
import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { CliKintoneError } from "../error";
import { RunError } from "../../record/error";
import type { LocalRecord } from "../../record/import/types/record";
import { AddRecordsError } from "../../record/import/usecases/add/error";
import type { RecordSchema } from "../../record/import/types/schema";

const CHUNK_SIZE = 100;

describe("CliKintoneError", () => {
  it("toStringCause should output the correct sentence. (inner: CliKintoneError)", () => {
    const cliKintoneError = new CliKintoneErrorForTest(
      new CliKintoneErrorForTest("This is a root cause.")
    );
    expect(cliKintoneError.toString()).toBe(
      "Error ocurred\nError ocurred\nThis is a root cause.\n"
    );
  });

  it("toStringCause should output the correct sentence. (inner: KintoneAllRecordsError)", () => {
    const numOfAllRecords = 60;
    const numOfAlreadyImportedRecords = 10;
    const numOfProcessedRecords = 30;
    const errorIndex = 44;

    const kintoneAllRecordsError = buildKintoneAllRecordsError(
      numOfAllRecords,
      numOfProcessedRecords,
      numOfAlreadyImportedRecords,
      errorIndex
    );

    const error = new CliKintoneErrorForTest(kintoneAllRecordsError);

    expect(error.toString()).toBe(
      "Error ocurred\n[500] [some code] some error message (some id)\n"
    );
  });

  it("toStringCause should output the correct sentence. (inner: KintoneRestAPIError)", () => {
    const kintoneRestAPIError = buildKintoneRestAPIError();
    const runError = new RunError(kintoneRestAPIError);

    expect(runError.toString()).toBe(
      "[500] [some code] some error message (some id)\n"
    );
  });

  it("toStringCause should output the correct sentence. (inner: KintoneRestAPIError with GAIA_IL23)", () => {
    const kintoneRestAPIError = buildKintoneRestAPIError("GAIA_IL23");
    const runError = new RunError(kintoneRestAPIError);

    expect(runError.toString()).toBe(
      "please specify --guest-space-id option. \n"
    );
  });
});

class CliKintoneErrorForTest extends CliKintoneError {
  constructor(cause: unknown) {
    super("Error ocurred", cause);
  }
}

const buildKintoneRestAPIError = (code?: string): KintoneRestAPIError => {
  const errorResponse: KintoneErrorResponse = {
    data: {
      id: "some id",
      code: code ? code : "some code",
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

const buildKintoneRestAPIErrorByDefault = (
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

const buildKintoneAllRecordsError = (
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
  const kintoneRestAPIError = buildKintoneRestAPIErrorByDefault(
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
