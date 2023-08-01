import type { LayoutJson } from "../../../../kintone/types";
import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import type { SchemaTransformer } from "../";
import type { FieldSchema } from "../../types/schema";
import { tableLayoutComparator } from "./helpers/table";

/**
 * This transformer returns all supported fields.
 * This transformer sorts headerFields by the following rules.
 * - based on form layout of the kintone app
 * - When following fields are missing from layout,
 *   - RECORD_NUMBER: placed at just after the PRIMARY_MARK (or head of the array)
 *   - CREATOR      : placed at the end of the array
 *   - CREATED_TIME : placed at the end of the array
 *   - MODIFIER     : placed at the end of the array
 *   - UPDATED_TIME : placed at the end of the array
 * @param layoutJson
 */
export const formLayout = (layoutJson: LayoutJson): SchemaTransformer => {
  const comparator = formLayoutComparator(layoutJson);
  return (fields: FieldSchema[]) =>
    fields.sort(comparator).map((field) => {
      if (field.type === "SUBTABLE") {
        field.fields.sort(tableLayoutComparator(field.code, layoutJson));
      }
      return field;
    });
};

export const formLayoutComparator = (
  layoutJson: LayoutJson,
): ((fieldA: FieldSchema, fieldB: FieldSchema) => number) => {
  const flatLayout = flattenLayout(layoutJson.layout);
  return (fieldA, fieldB) => {
    // find fieldCode from layout
    const indexA = flatLayout.findIndex((field) => field.code === fieldA.code);
    const indexB = flatLayout.findIndex((field) => field.code === fieldB.code);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1 && indexB === -1) {
      if (fieldB.type === "RECORD_NUMBER") {
        return 1;
      }
      return -1;
    } else if (indexA === -1 && indexB !== -1) {
      if (fieldA.type === "RECORD_NUMBER") {
        return -1;
      }
      return 1;
    }

    const systemFieldsOrder = [
      "RECORD_NUMBER",
      "CREATOR",
      "CREATED_TIME",
      "MODIFIER",
      "UPDATED_TIME",
    ];

    return (
      systemFieldsOrder.findIndex((fieldType) => fieldA.type === fieldType) -
      systemFieldsOrder.findIndex((fieldType) => fieldB.type === fieldType)
    );
  };
};

const flattenLayout = (
  layout: LayoutJson["layout"],
): Array<{
  code: string;
  type: KintoneFormFieldProperty.OneOf["type"];
}> => {
  const fields: Array<{
    code: string;
    type: KintoneFormFieldProperty.OneOf["type"];
  }> = [];

  for (const row of layout) {
    switch (row.type) {
      case "ROW":
        for (const field of row.fields) {
          if (
            field.type !== "HR" &&
            field.type !== "LABEL" &&
            field.type !== "SPACER"
          ) {
            fields.push({ code: field.code, type: field.type });
          }
        }
        break;
      case "SUBTABLE":
        fields.push({ code: row.code, type: row.type });
        for (const field of row.fields) {
          fields.push({ code: field.code, type: field.type });
        }
        break;
      case "GROUP":
        fields.push(...flattenLayout(row.layout));
        break;
    }
  }
  return fields;
};
