import type { FieldsJson } from "../../../../../kintone/types";
import type { KintoneRecord } from "../../../types/record";

import { stringifyAsCsv } from "../index";

import { pattern as common } from "./fixtures/index/common";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/index/withFileAndAttachmentsDir";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/index/withFileAndNoAttachmentsDir";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndAttachmentsDir";
import { pattern as withSubtableAndFileAndNoAttachmentsDir } from "./fixtures/index/withSubtableAndFileAndNoAttachmentsDir";
import { pattern as withEmptySubtable } from "./fixtures/index/withEmptySubtable";

export type TestPattern = {
  description: string;
  fieldsJson: FieldsJson;
  input: KintoneRecord[];
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
      stringifyAsCsv(
        pattern.input,
        pattern.fieldsJson,
        pattern.useLocalFilePath
      )
    ).toEqual(pattern.expected);
  });
});
