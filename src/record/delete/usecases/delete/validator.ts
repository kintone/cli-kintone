import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber } from "../../types/field";
import type { InvalidRecordNumber } from "../../types/record";

export const validateRecordNumbers: (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordNumbers: RecordNumber[]
) => Promise<void> = async (apiClient, app, filePath) => {
  // todo: add logic for validating record number
  // invalid record number value
  //  - record numbers are mixed
  //  - Not number or app code
  //  - contain the app code other than kintone app's one.
  // not existing Record Number
  // duplicated Record Number
  const invalidValue: RecordNumber[] = [];
  const notExists: RecordNumber[] = [];
  const duplicated: RecordNumber[] = [];

  if (
    invalidValue.length > 0 ||
    notExists.length > 0 ||
    duplicated.length > 0
  ) {
    handleInvalidRecordNumbers({
      invalidValue,
      notExists,
      duplicated,
    });
  }
};

const handleInvalidRecordNumbers = (
  invalidRecordNumbers: InvalidRecordNumber
): void => {
  // todo: throw error
  throw new Error(
    `InvalidRecordNumbers: ${JSON.stringify(invalidRecordNumbers)}`
  );
};
