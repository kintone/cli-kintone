import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "./schema";
import { expected } from "./expected";
import { recordsOnKintone } from "./recordsOnKintone";
import { LocalRecordRepositoryMock } from "../../../../../repositories/localRecordRepositoryMock";

export const pattern: TestPattern = {
  description:
    "should upsert records correctly with a Record Number field even if the Record Number field isn't specified as update key",
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
