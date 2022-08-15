import { convertFieldValue } from "../fieldValue";
import * as Fields from "../../../types/field";

const patterns: Array<{
  input: Fields.OneOf;
  attachmentsDir?: string;
  expected: string;
}> = [
  {
    input: { type: "RECORD_NUMBER", value: "KINTONE-123" },
    expected: "KINTONE-123",
  },
  {
    input: { type: "SINGLE_LINE_TEXT", value: "text" },
    expected: "text",
  },
  {
    input: { type: "RADIO_BUTTON", value: "select1" },
    expected: "select1",
  },
  {
    input: { type: "MULTI_LINE_TEXT", value: "line1\nline2" },
    expected: "line1\nline2",
  },
  {
    input: { type: "NUMBER", value: "123" },
    expected: "123",
  },
  {
    input: {
      type: "RICH_TEXT",
      value:
        "<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div>",
    },
    expected:
      "<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div>",
  },
  {
    input: { type: "LINK", value: "https://kintone.dev/" },
    expected: "https://kintone.dev/",
  },
  {
    input: { type: "DROP_DOWN", value: "select1" },
    expected: "select1",
  },
  {
    input: { type: "CALC", value: "1234" },
    expected: "1234",
  },
  {
    input: { type: "UPDATED_TIME", value: "2022-03-15T07:21:00Z" },
    expected: "2022-03-15T07:21:00Z",
  },
  {
    input: { type: "CREATED_TIME", value: "2022-03-15T07:21:00Z" },
    expected: "2022-03-15T07:21:00Z",
  },
  {
    input: { type: "DATETIME", value: "2012-01-11T11:30:00Z" },
    expected: "2012-01-11T11:30:00Z",
  },
  {
    input: { type: "DATE", value: "2012-01-11" },
    expected: "2012-01-11",
  },
  {
    input: { type: "TIME", value: "11:30" },
    expected: "11:30",
  },
  {
    input: { type: "CREATOR", value: { code: "creator", name: "Creator" } },
    expected: "creator",
  },
  {
    input: { type: "MODIFIER", value: { code: "modifier", name: "Modifier" } },
    expected: "modifier",
  },

  {
    input: { type: "MULTI_SELECT", value: ["select1", "select2"] },
    expected: "select1\nselect2",
  },

  {
    input: { type: "CHECK_BOX", value: ["select1", "select2"] },
    expected: "select1\nselect2",
  },
  {
    input: {
      type: "FILE",
      value: [
        {
          contentType: "text/plain",
          fileKey: "file-key-123",
          name: "image.png",
          size: "123456",
          localFilePath: "attachment-1/image.png",
        },
        {
          contentType: "text/plain",
          fileKey: "file-key-123",
          name: "image2.png",
          size: "123456",
          localFilePath: "attachment-1/image2.png",
        },
      ],
    },
    expected: "image.png\nimage2.png",
  },
  {
    input: {
      type: "FILE",
      value: [
        {
          contentType: "text/plain",
          fileKey: "file-key-123",
          name: "image.png",
          size: "123456",
          localFilePath: "attachment-1/image.png",
        },
        {
          contentType: "text/plain",
          fileKey: "file-key-123",
          name: "image2.png",
          size: "123456",
          localFilePath: "attachment-1/image2.png",
        },
      ],
    },
    attachmentsDir: "attachments",
    expected: "attachment-1/image.png\nattachment-1/image2.png",
  },
  {
    input: { type: "FILE", value: [] },
    expected: "",
  },
  {
    input: {
      type: "USER_SELECT",
      value: [
        { code: "sato", name: "Sato" },
        { code: "tanaka", name: "Tanaka" },
      ],
    },
    expected: "sato\ntanaka",
  },
  {
    input: {
      type: "USER_SELECT",
      value: [],
    },
    expected: "",
  },
  {
    input: {
      type: "ORGANIZATION_SELECT",
      value: [
        { code: "Development Div", name: "Development Div" },
        { code: "Marketing Div", name: "Marketing Div" },
      ],
    },
    expected: "Development Div\nMarketing Div",
  },
  {
    input: {
      type: "ORGANIZATION_SELECT",
      value: [],
    },
    expected: "",
  },
  {
    input: {
      type: "GROUP_SELECT",
      value: [
        { code: "Administrators", name: "Administrators" },
        { code: "Maintainers", name: "Maintainers" },
      ],
    },
    expected: "Administrators\nMaintainers",
  },
  {
    input: {
      type: "GROUP_SELECT",
      value: [],
    },
    expected: "",
  },
  // Unsupported fields
  {
    input: { type: "CATEGORY", value: ["unsupported"] },
    expected: "",
  },
  {
    input: { type: "STATUS", value: "unsupported" },
    expected: "",
  },
  {
    input: {
      type: "STATUS_ASSIGNEE",
      value: [{ code: "unsupported", name: "unsupported" }],
    },
    expected: "",
  },
  {
    input: { type: "SUBTABLE", value: [] },
    expected: "",
  },
];

describe("convertFieldValue", () => {
  it.each(patterns)(
    "[$#] convert $input.type field correctly",
    ({ input, expected, attachmentsDir }) => {
      expect(convertFieldValue(input, attachmentsDir)).toStrictEqual(expected);
    }
  );
});
