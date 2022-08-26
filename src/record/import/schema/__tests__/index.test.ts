import type { FieldsJson } from "../../../../kintone/types";
import type { RecordSchema } from "../../types/schema";
import type { SchemaTransformer } from "../index";
import { createSchema } from "../index";

import { pattern as common } from "./fixtures/common";
import { pattern as userSelected } from "./fixtures/userSelected";
import { pattern as userSelectedWithUpdateKey } from "./fixtures/userSelectedWithUpdateKey";

export type TestPattern = {
  description: string;
  input: FieldsJson;
  transformer: SchemaTransformer;
  expected: RecordSchema;
};

describe("createSchema", () => {
  const patterns = [common, userSelected, userSelectedWithUpdateKey];
  it.each(patterns)("$description", (pattern) => {
    expect(createSchema(pattern.input, pattern.transformer)).toStrictEqual(
      pattern.expected
    );
  });
});
