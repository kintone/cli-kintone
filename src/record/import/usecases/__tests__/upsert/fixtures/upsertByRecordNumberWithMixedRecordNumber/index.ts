import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "./schema.js";
import { recordsOnKintone } from "./recordsOnKintone.js";

export const pattern: TestPattern = {
  description:
    "should throw error because the record numbers are mixed with those with and without app code",
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
  expected: {
    failure: {
      cause: new Error(
        'The "Key to Bulk Update" should not be mixed with those with and without app code',
      ),
    },
  },
};
