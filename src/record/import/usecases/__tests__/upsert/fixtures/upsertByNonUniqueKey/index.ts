import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";

export const pattern: TestPattern = {
  description: "should throw error when update key field is not unique",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "singleLineText_nonUnique",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: {
      cause: new Error("update key field should set to unique"),
    },
  },
};
