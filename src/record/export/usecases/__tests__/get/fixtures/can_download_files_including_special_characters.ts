import type { KintoneRecordForResponse } from "../../../../../../kintone/types";
import type { LocalRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";
import path from "path";

const fileInfo = {
  contentType: "text/plain",
  fileKey: "test-file-key",
  name: ':"t/e\\|s?*t<>.txt',
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

export const expected: LocalRecord[] = [
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
          localFilePath: path.join("attachment-2", "__t_e__s__t__.txt"),
        },
        {
          ...fileInfo,
          localFilePath: path.join("attachment-2", "__t_e__s__t__ (1).txt"),
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
          localFilePath: path.join("attachment-3", "__t_e__s__t__.txt"),
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
