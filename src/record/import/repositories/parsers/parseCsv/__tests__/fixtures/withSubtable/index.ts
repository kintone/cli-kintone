import type { TestPattern } from "../../index.test.js";

import { csv } from "./input.js";
import { schema } from "./schema.js";
import { expected } from "./expected.js";

export const pattern: TestPattern = {
  description: "should convert subtable included csv string to JSON correctly",
  schema: schema,
  input: csv,
  expected: expected,
};
