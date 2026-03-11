import type { TestPattern } from "../../index.test.js";

import { csv } from "./input.js";
import { schema } from "./schema.js";
import { expected } from "./expected.js";

export const pattern: TestPattern = {
  description: "should convert csv string with no record to JSON correctly",
  schema: schema,
  input: csv,
  expected: expected,
};
