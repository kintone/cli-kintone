import type { RecordNumber } from "../../../types/field.js";
import type { TestPattern } from "../index.test.js";

const appCode = "appcode";

const input: RecordNumber[] = [
  {
    value: `${appCode}-1`,
  },
  {
    value: `${appCode}-2`,
  },
];

const expected = {
  failure: undefined,
};

export const pattern: TestPattern = {
  description: "should not throw error",
  appCode,
  input,
  expected,
};
