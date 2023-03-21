import { jest } from "@jest/globals";
import { validateRecordNumbers } from "../index.js";
import { ValidatorError } from "../error.js";

import { pattern as withoutError } from "./fixtures/withoutError.js";
import { pattern as withInvalidValue } from "./fixtures/withInvalidValue.js";
import { pattern as withEmptyValue } from "./fixtures/withEmptyValue.js";
import { pattern as withNotExists } from "./fixtures/withNotExists.js";
import { pattern as withDuplicated } from "./fixtures/withDuplicated.js";
import { pattern as withMixedRecordNumber } from "./fixtures/withMixedRecordNumber.js";
import type { RecordNumber } from "../../types/field.js";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export type TestPattern = {
  description: string;
  appCode: string;
  input: RecordNumber[];
  expected: {
    failure?: {
      errorMessage: string;
    };
  };
};

describe("validateRecordNumbers", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  const patterns = [
    withoutError,
    withInvalidValue,
    withEmptyValue,
    withNotExists,
    withDuplicated,
    withMixedRecordNumber,
  ];
  it.each(patterns)("$description", (pattern) => {
    apiClient.record.getAllRecordsWithId = jest
      .fn<() => Promise<any[]>>()
      .mockResolvedValue([
        {
          $id: { value: "1" },
        },
        {
          $id: { value: "2" },
        },
        {
          $id: { value: "3" },
        },
      ]);

    if (pattern.expected.failure !== undefined) {
      return expect(
        validateRecordNumbers(apiClient, "1", pattern.appCode, pattern.input)
      ).rejects.toThrow(
        new ValidatorError(pattern.expected.failure.errorMessage)
      );
    }

    return expect(
      validateRecordNumbers(apiClient, "1", pattern.appCode, pattern.input)
    ).resolves.not.toThrow();
  });
});
