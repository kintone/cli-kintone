import type { RecordNumber } from "../../../types/field";
import type { TestPattern } from "../index.test";

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
