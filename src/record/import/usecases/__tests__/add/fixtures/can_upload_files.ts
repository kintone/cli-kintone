import type { KintoneRecord } from "../../../../types/record";
import type { KintoneRecordForParameter } from "../../../../../../kintone/types";
import type { RecordSchema } from "../../../../types/schema";

import path from "path";

export const input: KintoneRecord[] = [
  {
    singleLineText: {
      value: "value1",
    },
    attachment: {
      value: [
        {
          localFilePath: path.join("attachment-1", "test.txt"),
        },
        {
          localFilePath: path.join("attachment-1", "test (1).txt"),
        },
      ],
    },
  },
];

export const expected: KintoneRecordForParameter[] = [
  {
    singleLineText: {
      value: "value1",
    },
    attachment: {
      value: [
        {
          fileKey: "abcde",
        },
        {
          fileKey: "fghij",
        },
      ],
    },
  },
];

export const schema: RecordSchema = {
  fields: [
    {
      type: "SINGLE_LINE_TEXT",
      code: "singleLineText",
      label: "singleLineText",
      noLabel: false,
      required: false,
      minLength: "",
      maxLength: "",
      expression: "",
      hideExpression: false,
      unique: false,
      defaultValue: "",
    },
    {
      type: "FILE",
      code: "attachment",
      label: "attachment",
      noLabel: false,
      required: false,
      thumbnailSize: "150",
    },
  ],
};
