import type { RecordNumber } from "../../../types/field.js";
import type { TestPattern } from "../index.test.js";

const appCode = "";

const input: RecordNumber[] = [
  {
    value: "1",
  },
  {
    value: "test",
  },
  {
    value: "2",
  },
];

const expected = {
  failure: {
    errorMessage: "Invalid record number. ID: test",
  },
};

export const pattern: TestPattern = {
  description: "should throw error when the record number is invalid",
  appCode,
  input,
  expected,
};
