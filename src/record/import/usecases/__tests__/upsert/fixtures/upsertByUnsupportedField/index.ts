import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "../schema.js";
import { recordsOnKintone } from "../recordsOnKintone.js";

export const pattern: TestPattern = {
  description:
    "should throw error when unsupported field is passed as update key",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "date",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: { cause: new Error("unsupported field type for update key") },
  },
};
