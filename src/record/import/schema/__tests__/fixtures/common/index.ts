import type { TestPattern } from "../../index.test";
import { input } from "./input";
import { expected } from "./expected";
import { noop } from "../../../transformers/noop";

export const pattern: TestPattern = {
  description: "should create schema correctly",
  transformer: noop(),
  input: input,
  expected: expected,
};
