import type { SchemaTransformer } from "../index.js";
import { createSchema } from "../index.js";
import type { FieldsJson } from "../../../../kintone/types.js";
import type { RecordSchema } from "../../types/schema.js";

import { pattern as formLayout } from "./fixtures/formLayout/index.js";
import { pattern as formLayoutNoSystemFields } from "./fixtures/formLayoutNoSystemFields/index.js";
import { pattern as userSelected } from "./fixtures/userSelected/index.js";

export type TestPattern = {
  description: string;
  input: FieldsJson;
  transformer: SchemaTransformer;
  expected: RecordSchema;
};

describe("createSchema", () => {
  const patterns = [formLayout, formLayoutNoSystemFields, userSelected];
  it.each(patterns)("$description", (pattern) => {
    expect(createSchema(pattern.input, pattern.transformer)).toStrictEqual(
      pattern.expected,
    );
  });
});
