import type { KintoneRecord } from "../../../types/record.js";
import type { RecordSchema } from "../../../types/schema.js";

import { stringifyAsCsv } from "../index.js";

import { pattern as common } from "./fixtures/index/common/index.js";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/index/withFileAndAttachmentsDir/index.js";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/index/withFileAndNoAttachmentsDir/index.js";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndAttachmentsDir/index.js";
import { pattern as withSubtableAndFileAndNoAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndNoAttachmentsDir/index.js";
import { pattern as withEmptySubtable } from "./fixtures/index/withEmptySubtable/index.js";

export type TestPattern = {
  description: string;
  input: KintoneRecord[];
  schema: RecordSchema;
  useLocalFilePath: boolean;
  expected: string;
};

describe("stringifyAsCsv", () => {
  const patterns: TestPattern[] = [
    common,
    withFileAndAttachmentsDir,
    withFileAndNoAttachmentsDir,
    withSubtableAndFileAndAttachmentsDir,
    withSubtableAndFileAndNoAttachmentsDir,
    withEmptySubtable,
  ];
  it.each(patterns)("$description", (pattern) => {
    expect(
      stringifyAsCsv(pattern.input, pattern.schema, pattern.useLocalFilePath)
    ).toEqual(pattern.expected);
  });
});
