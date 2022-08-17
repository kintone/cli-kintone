import type { FieldsJson, LayoutJson } from "../../../../../kintone/types";

import { buildHeaderFields } from "../header";
import { PRIMARY_MARK } from "../constants";

const fieldsJson: FieldsJson = require("./fixtures/header/fields.json");
const layoutJson: LayoutJson = require("./fixtures/header/layout.json");
const fileFieldsJson: FieldsJson = require("./fixtures/header/file_fields.json");
const fileLayoutJson: LayoutJson = require("./fixtures/header/file_layout.json");
const systemFieldsFieldsJson: FieldsJson = require("./fixtures/header/systemfields_fields.json");
const systemFieldsLayoutJson: LayoutJson = require("./fixtures/header/systemfields_layout.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/header/subtable_fields.json");
const subtableLayoutJson: LayoutJson = require("./fixtures/header/subtable_layout.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array correctly (data without subtable)", () => {
    expect(
      buildHeaderFields(fieldsJson, layoutJson).includes(PRIMARY_MARK)
    ).toBe(false);

    expect(buildHeaderFields(fieldsJson, layoutJson)).toStrictEqual([
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
    expect(buildHeaderFields(fileFieldsJson, fileLayoutJson)).toStrictEqual([
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
    expect(
      buildHeaderFields(systemFieldsFieldsJson, systemFieldsLayoutJson)
    ).toStrictEqual([
      "recordNumber",
      "dropDown",
      "richText",
      "singleLineText",
      "number",
      "radioButton",
      "multiLineText",
      "checkBox",
      "calc",
      "multiSelect",
      "userSelect",
      "organizationSelect",
      "groupSelect",
      "date",
      "dateTime",
      "time",
      "creator",
      "createdTime",
      "modifier",
      "updatedTime",
    ]);
  });
  it("should generate fieldCode array correctly (data with subtable)", () => {
    expect(
      buildHeaderFields(subtableFieldsJson, subtableLayoutJson).includes(
        PRIMARY_MARK
      )
    ).toBe(true);
    expect(
      buildHeaderFields(subtableFieldsJson, subtableLayoutJson)
    ).toStrictEqual([
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
