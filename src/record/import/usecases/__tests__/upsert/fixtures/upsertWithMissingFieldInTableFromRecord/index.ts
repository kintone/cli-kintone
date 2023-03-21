import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "./schema.js";
import { recordsOnKintone } from "./recordsOnKintone.js";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock.js";

export const pattern: TestPattern = {
  description:
    "should throw error when the field in table specified in schema does not exist on input record",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv"),
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
        'The specified field "numberInTable" does not exist on the CSV'
      ),
    },
  },
};
