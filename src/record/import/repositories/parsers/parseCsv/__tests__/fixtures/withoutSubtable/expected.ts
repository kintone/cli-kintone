import type { LocalRecord } from "../../../../../../types/record";

export const expected: LocalRecord[] = [
  {
    data: {
      dropDown: {
        value: "sample1",
      },
      richText: {
        value:
          "<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>",
      },
      singleLineText: {
        value: '"single line text"',
      },
      number: {
        value: "8",
      },
      radioButton: {
        value: "sample2",
      },
      multiLineText: {
        value: "multi\nline\ntext",
      },
      multiSelect: {
        value: ['"sample3"', "sample4,sample5"],
      },
      checkBox: {
        value: ['"sample2"'],
      },
      createdTime: {
        value: "2021-02-10T06:14:00Z",
      },
      updatedTime: {
        value: "2021-02-16T02:43:00Z",
      },
      creator: {
        value: {
          code: "username",
        },
      },
      modifier: {
        value: {
          code: "username",
        },
      },
      userSelect: {
        value: [
          {
            code: "sato",
          },
          {
            code: "tanaka",
          },
        ],
      },
      groupSelect: {
        value: [
          {
            code: "Administrators",
          },
        ],
      },
      organizationSelect: {
        value: [
          {
            code: "Development Div",
          },
        ],
      },
      file: {
        value: [
          { localFilePath: "AttachementFolder/1.png" },
          { localFilePath: "AttachementFolder/2.png" },
        ],
      },
      date: {
        value: "2022-04-11",
      },
      dateTime: {
        value: "2022-04-11T07:39:00Z",
      },
      time: {
        value: "16:39",
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
    },
  },
];
