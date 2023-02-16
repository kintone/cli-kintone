import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock";

export const pattern: TestPattern = {
  description:
    "should throw error when the field specified in schema does not exist on input record",
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
      errorMessage:
        'The specified field "singleLineText_nonExistentOnInput" does not exist on the CSV',
    },
  },
};
