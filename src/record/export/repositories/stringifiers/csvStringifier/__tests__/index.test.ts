import type { LocalRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";

import { CsvStringifier } from "../index";

import { pattern as common } from "./fixtures/index/common";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/index/withFileAndAttachmentsDir";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/index/withFileAndNoAttachmentsDir";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndAttachmentsDir";
import { pattern as withSubtableAndFileAndNoAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndNoAttachmentsDir";
import { pattern as withEmptySubtable } from "./fixtures/index/withEmptySubtable";

export type TestPattern = {
  description: string;
  input: LocalRecord[];
  schema: RecordSchema;
  useLocalFilePath: boolean;
  expected: string;
};

describe("csvStringifier", () => {
  const patterns: TestPattern[] = [
    common,
    withFileAndAttachmentsDir,
    withFileAndNoAttachmentsDir,
    withSubtableAndFileAndAttachmentsDir,
    withSubtableAndFileAndNoAttachmentsDir,
    withEmptySubtable,
  ];
  it.each(patterns)("$description", async (pattern) => {
    const csvStringifier = new CsvStringifier(
      pattern.schema,
      pattern.useLocalFilePath
    );
    const actual = await csvStringifier.stringify(pattern.input);
    expect(actual).toEqual(pattern.expected);
  });
});
