import { KintoneRecordForResponse } from "../../../../../../kintone/types";
import path from "path";
import { KintoneRecord } from "../../../../types/record";
import { RecordSchema } from "../../../../types/schema";

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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537306",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo, fileInfo],
            },
          },
        },
        {
          id: "537307",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo],
            },
          },
        },
      ],
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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537308",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo],
            },
          },
        },
      ],
    },
  },
];

export const expected: KintoneRecord[] = [
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537306",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-0", "test.txt"),
                },
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-0", "test (1).txt"),
                },
              ],
            },
          },
        },
        {
          id: "537307",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-1", "test.txt"),
                },
              ],
            },
          },
        },
      ],
    },
  },
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537308",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-3-0", "test.txt"),
                },
              ],
            },
          },
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
      type: "SUBTABLE",
      code: "subTable",
      label: "subTable",
      noLabel: false,
      fields: [
        {
          type: "FILE",
          code: "attachment",
          label: "attachment",
          noLabel: false,
          thumbnailSize: "50",
          required: false,
        },
      ],
    },
  ],
  hasSubtable: true,
  useLocalFilePath: true,
  attachmentsDir: "attachments",
};
