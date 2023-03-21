import { buildHeaderFields } from "../header.js";
import { PRIMARY_MARK } from "../constants.js";

import { schema } from "./fixtures/header/schema.js";
import { schema as fileSchema } from "./fixtures/header/file_schema.js";
import { schema as subtableSchema } from "./fixtures/header/subtable_schema.js";

describe("buildHeaderFields", () => {
  it("should generate fieldCode array correctly (data without subtable)", () => {
    expect(buildHeaderFields(schema).includes(PRIMARY_MARK)).toBe(false);

    expect(buildHeaderFields(schema)).toStrictEqual([
      "recordNumber",
      "updatedTime",
      "dropDown",
      "creator",
      "modifier",
      "richText",
      "singleLineText",
      "number",
      "radioButton",
      "multiLineText",
      "createdTime",
      "checkBox",
      "calc",
      "multiSelect",
      "userSelect",
      "organizationSelect",
      "groupSelect",
      "date",
      "dateTime",
      "time",
    ]);
    expect(buildHeaderFields(fileSchema)).toStrictEqual([
      "recordNumber",
      "updatedTime",
      "dropDown",
      "creator",
      "modifier",
      "richText",
      "singleLineText",
      "number",
      "radioButton",
      "multiLineText",
      "createdTime",
      "checkBox",
      "calc",
      "multiSelect",
      "file",
    ]);
  });
  it("should generate fieldCode array correctly (data with subtable)", () => {
    expect(buildHeaderFields(subtableSchema).includes(PRIMARY_MARK)).toBe(true);
    expect(buildHeaderFields(subtableSchema)).toStrictEqual([
      "*",
      "recordNumber",
      "updatedTime",
      "dropDown",
      "creator",
      "subTable",
      "subTableText",
      "subTableCheckbox",
      "subTableFile",
      "userSelect",
      "organizationSelect",
      "groupSelect",
      "modifier",
      "richText",
      "singleLineText",
      "number",
      "radioButton",
      "multiLineText",
      "createdTime",
      "checkBox",
      "calc",
      "multiSelect",
    ]);
  });
});
