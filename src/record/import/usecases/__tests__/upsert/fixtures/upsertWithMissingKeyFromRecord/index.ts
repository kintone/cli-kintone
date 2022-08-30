import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";

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
  expected: {
    failure: {
      errorMessage:
        'The field specified as "Key to Bulk Update" (singleLineText_nonExistentOnInput) does not exist on input',
    },
  },
};
