import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";

export const pattern: TestPattern = {
  description:
    "should throw error when non-existent field is passed as update key",
  input: {
    records: records,
    schema: schema,
    updateKey: "nonExistentField",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  recordsOnKintone: recordsOnKintone,
  expected: {
    failure: { errorMessage: "no such update key" },
  },
};
