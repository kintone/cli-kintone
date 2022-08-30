import { TestPattern } from "../../index.test";
import { records } from "./records";
import { schema } from "../schema";

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
  expected: {
    failure: { errorMessage: "no such update key" },
  },
};
