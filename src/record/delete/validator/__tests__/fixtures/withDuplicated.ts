import type { RecordNumber } from "../../../types/field.js";
import type { TestPattern } from "../index.test.js";

const appCode = "";

const input: RecordNumber[] = [
  {
    value: "1",
  },
  {
    value: "1",
  },
];

const expected = {
  failure: {
    errorMessage: "Duplicated record number. ID: 1",
  },
};

export const pattern: TestPattern = {
  description: "should throw error when the record number is duplicated",
  appCode,
  input,
  expected,
};
