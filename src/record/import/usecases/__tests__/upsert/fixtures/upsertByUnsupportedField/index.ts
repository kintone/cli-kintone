import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock";

export const pattern: TestPattern = {
  description:
    "should throw error when unsupported field is passed as update key",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv"),
    schema: schema,
    updateKey: "date",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: { cause: new Error("unsupported field type for update key") },
  },
};
