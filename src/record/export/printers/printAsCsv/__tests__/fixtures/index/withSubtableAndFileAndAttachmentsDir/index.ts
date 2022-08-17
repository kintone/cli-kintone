import { TestPattern } from "../../../index.test";
import { expectedCsv } from "./expected";
import { input } from "./input";
import { schema } from "./schema";

export const pattern: TestPattern = {
  description:
    "should convert kintone records to csv string correctly when SUBTABLE included with attachmentsDir option",
  input: input,
  schema: schema,
  expected: expectedCsv,
};
