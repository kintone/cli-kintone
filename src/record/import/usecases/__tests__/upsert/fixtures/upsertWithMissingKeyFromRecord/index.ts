import type { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";
import { recordsOnKintone } from "../recordsOnKintone";

export const pattern: TestPattern = {
  description:
    "should throw error when update key field does not exist on input record",
  input: {
    records: records,
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
