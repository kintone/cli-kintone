import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "./schema.js";
import { recordsOnKintone } from "./recordsOnKintone.js";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock.js";

export const pattern: TestPattern = {
  description: "should throw error because the record number is invalid",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv"),
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
      cause: new Error('The "Key to Bulk Update" value is invalid (Hoge-3)'),
    },
  },
};
