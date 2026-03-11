import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "./schema.js";
import { expected } from "./expected.js";
import { recordsOnKintone } from "./recordsOnKintone.js";

export const pattern: TestPattern = {
  description:
    "should upsert records correctly with record numbers on local and kintone have app code",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "recordNumber",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: expected,
};
