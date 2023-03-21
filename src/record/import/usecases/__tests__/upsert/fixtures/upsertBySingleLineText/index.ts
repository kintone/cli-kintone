import type { TestPattern } from "../../index.test.js";
import { records } from "./records.js";
import { schema } from "../schema.js";
import { expected } from "./expected.js";
import { recordsOnKintone } from "../recordsOnKintone.js";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock.js";

export const pattern: TestPattern = {
  description: "should upsert records correctly with single line text",
  input: {
    records: records,
    repository: new LocalRecordRepositoryMock(records, "csv"),
    schema: schema,
    updateKey: "singleLineText",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: expected,
};
