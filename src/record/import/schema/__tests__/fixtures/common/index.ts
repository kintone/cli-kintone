import type { TestPattern } from "../../index.test.js";
import { input } from "./input.js";
import { expected } from "./expected.js";
import { noop } from "../../../transformers/noop.js";

export const pattern: TestPattern = {
  description: "should create schema correctly",
  transformer: noop(),
  input: input,
  expected: expected,
};
