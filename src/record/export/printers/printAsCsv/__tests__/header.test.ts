import type { FieldsJson } from "../../../../../kintone/types";

import { buildHeaderFields } from "../header";
import { PRIMARY_MARK } from "../constants";

const fieldsJson: FieldsJson = require("./fixtures/header/fields.json");
const fileFieldsJson: FieldsJson = require("./fixtures/header/file_fields.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/header/subtable_fields.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array correctly (data without subtable)", () => {
    expect(buildHeaderFields(fieldsJson).includes(PRIMARY_MARK)).toBe(false);
    expect(buildHeaderFields(fieldsJson)).toHaveLength(20);
    expect(buildHeaderFields(fileFieldsJson)).toHaveLength(15);
  });
  it("should generate fieldCode array correctly (data with subtable)", () => {
    expect(buildHeaderFields(subtableFieldsJson).includes(PRIMARY_MARK)).toBe(
      true
    );
    expect(buildHeaderFields(subtableFieldsJson)).toHaveLength(22);
  });
});
