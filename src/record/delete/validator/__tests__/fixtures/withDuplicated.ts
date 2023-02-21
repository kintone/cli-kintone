import type { RecordNumber } from "../../../types/field";
import type { TestPattern } from "../index.test";

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
