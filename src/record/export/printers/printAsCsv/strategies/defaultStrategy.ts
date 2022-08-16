import type { FieldsJson, LayoutJson } from "../../../../../kintone/types";
import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import type { Strategy } from "../header";

import { PRIMARY_MARK } from "../constants";

export const defaultStrategy = (
  fieldsJson: FieldsJson,
  layoutJson: LayoutJson
): Strategy => {
  return {
    filter: (code) => true,
    comparator: orderByFormLayoutComparator(fieldsJson, layoutJson),
  };
};

export const orderByFormLayoutComparator = (
  fieldsJson: FieldsJson,
  layoutJson: LayoutJson
): Strategy["comparator"] => {
  const flatLayout = flattenLayout(layoutJson.layout);
  return (codeA, codeB) => {
    // the PRIMARY_MARK is always precedence
    if (codeA === PRIMARY_MARK) {
      return -1;
    }
    if (codeB === PRIMARY_MARK) {
      return 1;
    }

    // find fieldCode from layout
    const indexA = flatLayout.findIndex((field) => field.code === codeA);
    const indexB = flatLayout.findIndex((field) => field.code === codeB);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1 && indexB === -1) {
      if (fieldsJson.properties[codeB]?.type === "RECORD_NUMBER") {
        return 1;
      }
      return -1;
    } else if (indexA === -1 && indexB !== -1) {
      if (fieldsJson.properties[codeA]?.type === "RECORD_NUMBER") {
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
      systemFieldsOrder.indexOf(fieldsJson.properties[codeA].type) -
      systemFieldsOrder.indexOf(fieldsJson.properties[codeB].type)
    );
  };
};

const flattenLayout = (
  layout: LayoutJson["layout"]
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
