import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";

export const pattern: TestPattern = {
  description:
    "should throw error when the field specified in schema does not exist on input record",
  input: {
    records: records,
    schema: schema,
    updateKey: "number",
    options: {
      attachmentsDir: "",
      skipMissingFields: false,
    },
  },
  expected: {
    failure: {
      errorMessage:
        'The specified field "singleLineText_nonExistentOnInput" does not exist on the CSV',
    },
  },
};
