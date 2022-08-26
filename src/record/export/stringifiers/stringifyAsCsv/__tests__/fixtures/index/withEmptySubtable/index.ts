import { TestPattern } from "../../../index.test";
import { expectedCsv } from "./expected";
import { input } from "./input";
import { schema } from "./schema";

export const pattern: TestPattern = {
  description:
    "should convert kintone records to csv string correctly when SUBTABLE value is an empty array",
  input: input,
  schema: schema,
  useLocalFilePath: true,
  expected: expectedCsv,
};
