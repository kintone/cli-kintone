import type { TestPattern } from "../../index.test.js";
import { input } from "./input.js";
import { expected } from "./expected.js";
import { userSelected } from "../../../transformers/userSelected.js";
import { fields } from "./fields.js";

export const pattern: TestPattern = {
  description: "userSelected should create schema correctly",
  transformer: userSelected(fields, input),
  input: input,
  expected: expected,
};
