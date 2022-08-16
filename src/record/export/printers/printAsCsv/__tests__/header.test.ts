import type { FieldsJson, LayoutJson } from "../../../../../kintone/types";

import { buildHeaderFields } from "../header";
import { PRIMARY_MARK } from "../constants";
import { defaultStrategy } from "../strategies/defaultStrategy";

const fieldsJson: FieldsJson = require("./fixtures/header/fields.json");
const layoutJson: LayoutJson = require("./fixtures/header/layout.json");
const fileFieldsJson: FieldsJson = require("./fixtures/header/file_fields.json");
const fileLayoutJson: LayoutJson = require("./fixtures/header/file_layout.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/header/subtable_fields.json");
const subtableLayoutJson: LayoutJson = require("./fixtures/header/subtable_layout.json");

describe("buildHeaderFields", () => {
  it("should generate fieldCode array correctly (data without subtable)", () => {
    expect(
      buildHeaderFields(
        fieldsJson,
        layoutJson,
        defaultStrategy(fieldsJson, layoutJson)
      ).includes(PRIMARY_MARK)
    ).toBe(false);
    expect(
      buildHeaderFields(
        fieldsJson,
        layoutJson,
        defaultStrategy(fieldsJson, layoutJson)
      )
    ).toHaveLength(20);
    expect(
      buildHeaderFields(
        fileFieldsJson,
        fileLayoutJson,
        defaultStrategy(fileFieldsJson, fileLayoutJson)
      )
    ).toHaveLength(15);
  });
  it("should generate fieldCode array correctly (data with subtable)", () => {
    expect(
      buildHeaderFields(
        subtableFieldsJson,
        subtableLayoutJson,
        defaultStrategy(subtableFieldsJson, subtableLayoutJson)
      ).includes(PRIMARY_MARK)
    ).toBe(true);
    expect(
      buildHeaderFields(
        subtableFieldsJson,
        subtableLayoutJson,
        defaultStrategy(subtableFieldsJson, subtableLayoutJson)
      )
    ).toHaveLength(22);
  });
});
