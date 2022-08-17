import type { FieldsJson, LayoutJson } from "../../../../kintone/types";

import {
  PRIMARY_MARK,
  supportedFieldTypes,
  supportedFieldTypesInSubtable,
} from "./constants";
import { hasSubtable } from "./subtable";
import { formLayout } from "./headerTransformers/formLayout";

export type HeaderTransformer = {
  filter: (code: string) => boolean;
  comparator: (codeA: string, codeB: string) => number;
};

export const buildHeaderFields = (
  fieldsJson: FieldsJson,
  layoutJson: LayoutJson,
  transformer: HeaderTransformer = formLayout(fieldsJson, layoutJson)
): string[] => {
  const headerFields: string[] = [];

  if (hasSubtable(fieldsJson)) {
    headerFields.push(PRIMARY_MARK);
  }

  for (const [fieldCode, field] of Object.entries(fieldsJson.properties)) {
    if (!supportedFieldTypes.includes(field.type)) {
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

  return headerFields.filter(transformer.filter).sort(transformer.comparator);
};
