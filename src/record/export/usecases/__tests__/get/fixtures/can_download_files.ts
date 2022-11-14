import type { KintoneRecordForResponse } from "../../../../../../kintone/types";
import path from "path";
import type { KintoneRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";

const fileInfo = {
  contentType: "text/plain",
  fileKey: "test-file-key",
  name: "test.txt",
  size: "123456",
};

export const input: KintoneRecordForResponse[] = [
  {
    $id: {
      type: "__ID__",
      value: "2",
    },
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    attachment: {
      type: "FILE",
      value: [fileInfo, fileInfo],
    },
  },
  {
    $id: {
      type: "__ID__",
      value: "3",
    },
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    attachment: {
      type: "FILE",
      value: [fileInfo],
    },
  },
];

export const expected: KintoneRecord[] = [
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    attachment: {
      type: "FILE",
      value: [
        {
          ...fileInfo,
          localFilePath: path.join("attachment-2", "test.txt"),
        },
        {
          ...fileInfo,
          localFilePath: path.join("attachment-2", "test (1).txt"),
        },
      ],
    },
  },
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    attachment: {
      type: "FILE",
      value: [
        {
          ...fileInfo,
          localFilePath: path.join("attachment-3", "test.txt"),
        },
      ],
    },
  },
];

export const schema: RecordSchema = {
  fields: [
    {
      type: "SINGLE_LINE_TEXT",
      code: "value1",
      label: "value1",
      noLabel: false,
      required: true,
      defaultValue: "",
      unique: false,
      minLength: "123",
      maxLength: "0",
      expression: "",
      hideExpression: false,
    },
    {
      type: "FILE",
      code: "attachment",
      label: "attachment",
      noLabel: false,
      thumbnailSize: "50",
      required: false,
    },
  ],
  hasSubtable: false,
};
