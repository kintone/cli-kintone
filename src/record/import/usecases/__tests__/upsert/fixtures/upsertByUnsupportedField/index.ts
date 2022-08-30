import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";

export const pattern: TestPattern = {
  description:
    "should throw error when unsupported field is passed as update key",
  input: {
    records: records,
    schema: schema,
    updateKey: "date",
    options: {
      attachmentsDir: "",
      skipMissingFields: true,
    },
  },
  expected: {
    failure: { errorMessage: "unsupported field type for update key" },
  },
};
