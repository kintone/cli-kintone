import type { FieldsJson, LayoutJson } from "../../../../kintone/types";
import { userSelected } from "../transformers/userSelected";

export const fieldsJson: FieldsJson = {
  revision: "29",
  properties: {
    recordNumber: {
      type: "RECORD_NUMBER",
      code: "recordNumber",
      label: "recordNumber",
      noLabel: false,
    },
    subTable: {
      type: "SUBTABLE",
      code: "subTable",
      noLabel: false,
      label: "subTable",
      fields: {
        subTableText: {
          type: "SINGLE_LINE_TEXT",
          code: "subTableText",
          label: "subTableText",
          noLabel: false,
          required: false,
          minLength: "",
          maxLength: "",
          expression: "",
          hideExpression: false,
          unique: false,
          defaultValue: "",
        },
        subTableFile: {
          type: "FILE",
          code: "subTableFile",
          label: "subTableFile",
          noLabel: false,
          required: false,
          thumbnailSize: "150",
        },
      },
    },
    richText: {
      type: "RICH_TEXT",
      code: "richText",
      label: "richText",
      noLabel: false,
      required: false,
      defaultValue: "",
    },
    Categories: {
      type: "CATEGORY",
      code: "Categories",
      label: "Categories",
      enabled: false,
    },
  },
};

const layoutJson: LayoutJson = {
  revision: "29",
  layout: [],
};

describe("userSelected", () => {
  it("should throw an Error if specified field is in a Table field", () => {
    expect(() =>
      userSelected(["recordNumber", "subTableText"], fieldsJson, layoutJson),
    ).toThrow(
      'The field in a Table cannot be specified to the fields option ("subTableText")\nPlease specify the Table field instead',
    );
  });
  it("should throw an Error if specified field does not exist", () => {
    expect(() =>
      userSelected(
        ["recordNumber", "HyperKintoneText"],
        fieldsJson,
        layoutJson,
      ),
    ).toThrow(
      'The specified field "HyperKintoneText" does not exist on the app',
    );
  });
  it("should throw an Error if specified field is not supported", () => {
    expect(() =>
      userSelected(["recordNumber", "Categories"], fieldsJson, layoutJson),
    ).toThrow('The specified field "Categories" is not supported');
  });
});
