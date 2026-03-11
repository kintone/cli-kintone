import type { LocalRecord } from "../../../../types/record.js";
import type { RecordSchema } from "../../../../types/schema.js";

import { CsvStringifier } from "../index.js";

import { pattern as common } from "./fixtures/index/common/index.js";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/index/withFileAndAttachmentsDir/index.js";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/index/withFileAndNoAttachmentsDir/index.js";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndAttachmentsDir/index.js";
import { pattern as withSubtableAndFileAndNoAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndNoAttachmentsDir/index.js";
import { pattern as withEmptySubtable } from "./fixtures/index/withEmptySubtable/index.js";
import { pattern as withNoRecord } from "./fixtures/index/withNoRecord/index.js";
import { Readable } from "stream";

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
    withNoRecord,
  ];
  it.each(patterns)("$description", async (pattern) => {
    const csvStringifier = new CsvStringifier(
      pattern.schema,
      pattern.useLocalFilePath,
    );
    const source = Readable.from(pattern.input.map((record) => [record]));
    for await (const chunk of source) {
      await csvStringifier.write(chunk);
    }
    await csvStringifier.end();
    let actual = "";
    for await (const chunk of csvStringifier) {
      actual += chunk;
    }
    expect(actual).toEqual(pattern.expected);
  });
});
