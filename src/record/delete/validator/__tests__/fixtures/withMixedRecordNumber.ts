import type { RecordNumber } from "../../../types/field";
import type { TestPattern } from "../index.test";

const appCode = "appcode";

const input: RecordNumber[] = [
  {
    value: "appcode-1",
  },
  {
    value: "2",
  },
];

const expected = {
  failure: {
    errorMessage:
      "The record number should not be mixed with those with and without app code",
  },
};

export const pattern: TestPattern = {
  description: "should throw error when the record number is mixed",
  appCode,
  input,
  expected,
};
