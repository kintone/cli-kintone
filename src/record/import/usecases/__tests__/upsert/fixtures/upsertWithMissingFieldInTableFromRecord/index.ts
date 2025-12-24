import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "./schema";
import { recordsOnKintone } from "./recordsOnKintone";

export const pattern: TestPattern = {
  description:
    "should throw error when the field in table specified in schema does not exist on input record",
  input: {
    repository: { source: records, format: "csv" },
    schema: schema,
    updateKey: "number",
    options: {
      attachmentsDir: "",
      skipMissingFields: false,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: {
      cause: new Error(
        'The specified field "numberInTable" does not exist on the CSV',
      ),
    },
  },
};
