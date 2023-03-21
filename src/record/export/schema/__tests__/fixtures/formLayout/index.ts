import type { TestPattern } from "../../index.test.js";
import { input } from "./input.js";
import { expected } from "./expected.js";
import { layoutJson } from "./layout.js";
import { formLayout } from "../../../transformers/formLayout.js";

export const pattern: TestPattern = {
  description: "formLayout should create schema correctly",
  transformer: formLayout(layoutJson),
  input: input,
  expected: expected,
};
