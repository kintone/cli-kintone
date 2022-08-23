import type { TestPattern } from "../../index.test";
import { input } from "./input";
import { expected } from "./expected";
import { layoutJson } from "./layout";
import { formLayout } from "../../../transformers/formLayout";

export const pattern: TestPattern = {
  description: "formLayout should create schema correctly",
  transformer: formLayout(layoutJson),
  input: input,
  expected: expected,
};
