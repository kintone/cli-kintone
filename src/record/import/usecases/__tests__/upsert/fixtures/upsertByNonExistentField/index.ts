import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "../schema.js";
import { recordsOnKintone } from "../recordsOnKintone.js";

export const pattern: TestPattern = {
  description:
    "should throw error when non-existent field is passed as update key",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "nonExistentField",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: { cause: new Error("no such update key") },
  },
};
