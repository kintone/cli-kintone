import type { TestPattern } from "../../../index.test.js";
import { expectedCsv } from "./expected.js";
import { input } from "./input.js";
import { schema } from "./schema.js";

export const pattern: TestPattern = {
  description:
    "should convert kintone records to csv string correctly when SUBTABLE value is an empty array",
  input: input,
  schema: schema,
  useLocalFilePath: true,
  expected: expectedCsv,
};
