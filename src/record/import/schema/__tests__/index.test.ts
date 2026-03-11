import type { FieldsJson } from "../../../../kintone/types.js";
import type { RecordSchema } from "../../types/schema.js";
import type { SchemaTransformer } from "../index.js";
import { createSchema } from "../index.js";

import { pattern as common } from "./fixtures/common/index.js";
import { pattern as userSelected } from "./fixtures/userSelected/index.js";
import { pattern as userSelectedWithUpdateKey } from "./fixtures/userSelectedWithUpdateKey/index.js";

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
      pattern.expected,
    );
  });
});
