import type { RecordNumber } from "../../../types/field";
import type { TestPattern } from "../index.test";

const appCode = "";

const input: RecordNumber[] = [
  {
    value: "1",
  },
  {
    value: "99999",
  },
];

const expected = {
  failure: {
    errorMessage: "Not exists record number. ID: 99999",
  },
};

export const pattern: TestPattern = {
  description: "should throw error when the record number is not exists",
  appCode,
  input,
  expected,
};
