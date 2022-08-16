import type { FieldsJson } from "../../../../kintone/types";

import {
  PRIMARY_MARK,
  supportedFieldTypes,
  supportedFieldTypesInSubtable,
} from "./constants";
import { hasSubtable } from "./subtable";

export const buildHeaderFields = (fieldsJson: FieldsJson): string[] => {
  const headerFields: string[] = [];

  if (hasSubtable(fieldsJson)) {
    headerFields.push(PRIMARY_MARK);
  }

  for (const [fieldCode, field] of Object.entries(fieldsJson.properties)) {
    if (!supportedFieldTypes.includes(fieldsJson.properties[fieldCode].type)) {
      continue;
    }

    headerFields.push(fieldCode);

    if (field.type === "SUBTABLE") {
      for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
        field.fields
      )) {
        if (!supportedFieldTypesInSubtable.includes(fieldInSubtable.type)) {
          continue;
        }
        headerFields.push(fieldCodeInSubtable);
      }
    }
  }
  return headerFields;
};
