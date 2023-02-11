import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock";

export const pattern: TestPattern = {
  description:
    "should throw error when update key field does not exist on input record",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv", records.length),
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
      errorMessage:
        'The field specified as "Key to Bulk Update" (singleLineText_nonExistentOnInput) does not exist on the input',
    },
  },
};
