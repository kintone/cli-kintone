import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { expected } from "./expected";
import { recordsOnKintone } from "../recordsOnKintone";

export const pattern: TestPattern = {
  description: "should upsert records correctly with single line text",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "singleLineText",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: expected,
};
