import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "../schema.js";
import { recordsOnKintone } from "../recordsOnKintone.js";

export const pattern: TestPattern = {
  description:
    "should throw error when update key field does not exist on input record",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "singleLineText_nonExistentOnInput",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: {
      cause: new Error(
        'The field specified as "Key to Bulk Update" (singleLineText_nonExistentOnInput) does not exist on the input',
      ),
    },
  },
};
