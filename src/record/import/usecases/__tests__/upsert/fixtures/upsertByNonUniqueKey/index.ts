import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";

export const pattern: TestPattern = {
  description: "should throw error when update key field is not unique",
  input: {
    records: records,
    schema: schema,
    updateKey: "singleLineText_nonUnique",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  expected: {
    failure: { errorMessage: "update key field should set to unique" },
  },
};
