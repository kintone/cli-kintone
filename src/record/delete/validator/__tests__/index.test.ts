import { validateRecordNumbers } from "../index";
import { ValidatorError } from "../error";

import { pattern as withoutError } from "./fixtures/withoutError";
import { pattern as withInvalidValue } from "./fixtures/withInvalidValue";
import { pattern as withEmptyValue } from "./fixtures/withEmptyValue";
import { pattern as withNotExists } from "./fixtures/withNotExists";
import { pattern as withDuplicated } from "./fixtures/withDuplicated";
import { pattern as withMixedRecordNumber } from "./fixtures/withMixedRecordNumber";
import type { RecordNumber } from "../../types/field";
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
    apiClient.record.getAllRecordsWithId = jest.fn().mockResolvedValue([
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
