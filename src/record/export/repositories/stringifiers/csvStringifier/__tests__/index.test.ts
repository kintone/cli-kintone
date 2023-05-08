import type { LocalRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";

import { CsvStringifier } from "../index";

import { pattern as common } from "./fixtures/index/common";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/index/withFileAndAttachmentsDir";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/index/withFileAndNoAttachmentsDir";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndAttachmentsDir";
import { pattern as withSubtableAndFileAndNoAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndNoAttachmentsDir";
import { pattern as withEmptySubtable } from "./fixtures/index/withEmptySubtable";
import { pattern as withNoRecord } from "./fixtures/index/withNoRecord";
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
      pattern.useLocalFilePath
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
