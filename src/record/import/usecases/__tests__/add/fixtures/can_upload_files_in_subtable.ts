import type { LocalRecord } from "../../../../types/record";
import type { KintoneRecordForParameter } from "../../../../../../kintone/types";
import type { RecordSchema } from "../../../../types/schema";

import path from "path";
import { LocalRecordRepositoryMock } from "../../../../repositories/localRecordRepositoryMock";

export const inputRecords: LocalRecord[] = [
  {
    data: {
      singleLineText: {
        value: "value1",
      },
      table: {
        value: [
          {
            value: {
              attachmentInSubtable: {
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
          },
        ],
      },
    },
    metadata: {
      recordIndex: 0,
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
    },
  },
];

export const input = new LocalRecordRepositoryMock(inputRecords, "csv", 1);

export const expected: KintoneRecordForParameter[] = [
  {
    singleLineText: {
      value: "value1",
    },
    table: {
      value: [
        {
          id: undefined,
          value: {
            attachmentInSubtable: {
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
      type: "SUBTABLE",
      code: "table",
      noLabel: false,
      label: "table",
      fields: [
        {
          type: "FILE",
          code: "attachmentInSubtable",
          label: "attachmentInSubtable",
          noLabel: false,
          required: false,
          thumbnailSize: "150",
        },
      ],
    },
  ],
};
