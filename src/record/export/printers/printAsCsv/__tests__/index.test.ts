import { stringifyAsCsv } from "../index";
import { FieldsJson } from "../../../../../kintone/types";
import { KintoneRecord } from "../../../types/record";

import { pattern as common } from "./fixtures/common";
import { pattern as withFileAndAttachmentsDir } from "./fixtures/withFileAndAttachmentsDir";
import { pattern as withFileAndNoAttachmentsDir } from "./fixtures/withFileAndNoAttachmentsDir";
import { pattern as withSubtableAndFileAndAttachmentsDir } from "./fixtures/withSubtableAndFileAndAttachmentsDir";
import { pattern as withEmptySubtable } from "./fixtures/withEmptySubtable";

export type TestPattern = {
  description: string;
  fieldsJson: FieldsJson;
  input: KintoneRecord[];
  attachmentsDir?: string;
  expected: string;
};

describe("stringifyAsCsv", () => {
  const patterns: TestPattern[] = [
    common,
    withFileAndAttachmentsDir,
    withFileAndNoAttachmentsDir,
    withSubtableAndFileAndAttachmentsDir,
    withEmptySubtable,
  ];
  it.each(patterns)("$description", (pattern) => {
    expect(
      stringifyAsCsv(pattern.input, pattern.fieldsJson, pattern.attachmentsDir)
    ).toEqual(pattern.expected);
  });
});
