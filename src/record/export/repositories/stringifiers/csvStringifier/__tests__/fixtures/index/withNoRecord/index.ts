import type { TestPattern } from "../../../index.test";
import { expectedCsv } from "./expected";
import { input } from "./input";
import { schema } from "./schema";

export const pattern: TestPattern = {
  description: "should convert empty array to csv string correctly",
  input: input,
  schema: schema,
  useLocalFilePath: true,
  expected: expectedCsv,
};
