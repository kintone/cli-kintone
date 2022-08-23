import { createSchema, SchemaTransformer } from "../index";
import { FieldsJson } from "../../../../kintone/types";
import { RecordSchema } from "../../types/schema";

import { pattern as formLayout } from "./fixtures/formLayout";
import { pattern as formLayoutNoSystemFields } from "./fixtures/formLayoutNoSystemFields";

export type TestPattern = {
  description: string;
  input: FieldsJson;
  transformer: SchemaTransformer;
  expected: RecordSchema;
};

describe("createSchema", () => {
  const patterns = [formLayout, formLayoutNoSystemFields];
  it.each(patterns)("$description", (pattern) => {
    expect(createSchema(pattern.input, pattern.transformer)).toStrictEqual(
      pattern.expected
    );
  });
});
