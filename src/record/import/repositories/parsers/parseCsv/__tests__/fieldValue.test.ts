import type * as Fields from "../../../../types/field";
import type { FieldSchema } from "../../../../types/schema";

import { convertFieldValue } from "../fieldValue";

const patterns: Array<{
  input: { type: FieldSchema["type"]; value: string };
  expected: Fields.OneOf;
}> = [
  {
    input: { type: "CREATOR", value: "creator" },
    expected: { value: { code: "creator" } },
  },
  {
    input: { type: "CREATED_TIME", value: "2022-03-15T07:21:00Z" },
    expected: { value: "2022-03-15T07:21:00Z" },
  },
  {
    input: { type: "MODIFIER", value: "modifier" },
    expected: { value: { code: "modifier" } },
  },
  {
    input: { type: "UPDATED_TIME", value: "2022-03-15T07:21:00Z" },
    expected: { value: "2022-03-15T07:21:00Z" },
  },
  {
    input: { type: "SINGLE_LINE_TEXT", value: "text" },
    expected: { value: "text" },
  },
  { input: { type: "NUMBER", value: "123" }, expected: { value: "123" } },
  {
    input: { type: "MULTI_LINE_TEXT", value: "line1\nline2" },
    expected: { value: "line1\nline2" },
  },
  {
    input: {
      type: "RICH_TEXT",
      value:
        "<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div>",
    },
    expected: {
      value:
        "<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div>",
    },
  },
  {
    input: { type: "LINK", value: "https://kintone.dev/" },
    expected: { value: "https://kintone.dev/" },
  },
  {
    input: { type: "CHECK_BOX", value: "select1\nselect2" },
    expected: { value: ["select1", "select2"] },
  },
  {
    input: { type: "RADIO_BUTTON", value: "select1" },
    expected: { value: "select1" },
  },
  {
    input: { type: "DROP_DOWN", value: "select1" },
    expected: { value: "select1" },
  },
  {
    input: { type: "MULTI_SELECT", value: "select1\nselect2" },
    expected: { value: ["select1", "select2"] },
  },
  {
    input: {
      type: "FILE",
      value: "attachment-1/image.png\nattachment-1/image2.png",
    },
    expected: {
      value: [
        { localFilePath: "attachment-1/image.png" },
        { localFilePath: "attachment-1/image2.png" },
      ],
    },
  },
  {
    input: {
      type: "FILE",
      value: "",
    },
    expected: { value: [] },
  },
  {
    input: { type: "DATE", value: "2012-01-11" },
    expected: { value: "2012-01-11" },
  },
  {
    input: { type: "DATE", value: "2012/01/11" },
    expected: { value: "2012-01-11" },
  },
  { input: { type: "DATE", value: "" }, expected: { value: "" } },
  { input: { type: "TIME", value: "11:30" }, expected: { value: "11:30" } },
  { input: { type: "TIME", value: "" }, expected: { value: "" } },
  {
    input: { type: "DATETIME", value: "2012-01-11T11:30:00Z" },
    expected: { value: "2012-01-11T11:30:00Z" },
  },
  { input: { type: "DATETIME", value: "" }, expected: { value: "" } },
  {
    input: { type: "USER_SELECT", value: "sato\ntanaka" },
    expected: { value: [{ code: "sato" }, { code: "tanaka" }] },
  },
  {
    input: { type: "USER_SELECT", value: "" },
    expected: { value: [] },
  },
  {
    input: {
      type: "ORGANIZATION_SELECT",
      value: "Development Div\nMarketing Div",
    },
    expected: {
      value: [{ code: "Development Div" }, { code: "Marketing Div" }],
    },
  },
  {
    input: {
      type: "ORGANIZATION_SELECT",
      value: "",
    },
    expected: {
      value: [],
    },
  },
  {
    input: { type: "GROUP_SELECT", value: "Administrators\nMaintainers" },
    expected: { value: [{ code: "Administrators" }, { code: "Maintainers" }] },
  },
  {
    input: { type: "GROUP_SELECT", value: "" },
    expected: { value: [] },
  },
  {
    input: { type: "SUBTABLE", value: "unsupported" },
    expected: { value: "unsupported" },
  },
];

describe("convertFieldValue", () => {
  it.each(patterns)(
    "[$#] convert $input.type field correctly",
    ({ input, expected }) => {
      expect(convertFieldValue(input)).toStrictEqual(expected);
    },
  );
});
