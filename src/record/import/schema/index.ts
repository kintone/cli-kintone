import type { FieldsJson } from "../../../kintone/types";
import type { FieldSchema, RecordSchema } from "../types/schema";
import { isSupportedField, isSupportedFieldInSubtable } from "./constants";

export type SchemaTransformer = (
  fields: RecordSchema["fields"],
) => RecordSchema["fields"];

export const createSchema = (
  fieldsJson: FieldsJson,
  transformer: SchemaTransformer,
) => {
  const fields: FieldSchema[] = transformer(convert(fieldsJson.properties));

  return { fields };
};

const convert = (properties: FieldsJson["properties"]): FieldSchema[] => {
  const fields: FieldSchema[] = [];
  for (const property of Object.values(properties)) {
    if (!isSupportedField(property)) {
      continue;
    }
    if (property.type === "SUBTABLE") {
      const { fields: fieldsInSubtable, ...others } = property;
      fields.push({
        fields: Object.values(fieldsInSubtable).filter(
          isSupportedFieldInSubtable,
        ),
        ...others,
      });
      continue;
    }
    fields.push(property);
  }
  return fields;
};
