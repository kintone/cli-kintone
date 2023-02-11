import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock";

export const pattern: TestPattern = {
  description: "should throw error when update key field is not unique",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv", records.length),
    schema: schema,
    updateKey: "singleLineText_nonUnique",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: { errorMessage: "update key field should set to unique" },
  },
};
