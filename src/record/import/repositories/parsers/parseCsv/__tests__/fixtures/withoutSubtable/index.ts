import type { TestPattern } from "../../index.test";

import { csv } from "./input";
import { schema } from "./schema";
import { expected } from "./expected";

export const pattern: TestPattern = {
  description: "should convert csv string to JSON correctly",
  schema: schema,
  input: csv,
  expected: expected,
};
