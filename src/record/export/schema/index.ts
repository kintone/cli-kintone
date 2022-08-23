import { FieldsJson } from "../../../kintone/types";
import { FieldSchema, RecordSchema } from "../types/schema";
import {
  supportedFieldTypes,
  supportedFieldTypesInSubtable,
} from "./constants";

export type SchemaTransformer = (
  fields: RecordSchema["fields"]
) => RecordSchema["fields"];

export const createSchema = (
  fieldsJson: FieldsJson,
  transformer: SchemaTransformer
): RecordSchema => {
  const fields: FieldSchema[] = transformer(convert(fieldsJson.properties));

  const hasSubtable: boolean = fields.some(
    (field) => field.type === "SUBTABLE"
  );

  return {
    fields,
    hasSubtable,
  };
};

const convert = (properties: FieldsJson["properties"]): FieldSchema[] => {
  const fields: FieldSchema[] = [];
  for (const property of Object.values(properties)) {
    if (!supportedFieldTypes.includes(property.type)) {
      continue;
    }
    if (property.type === "SUBTABLE") {
      const { fields: fieldsInSubtable, ...others } = property;
      fields.push({
        fields: Object.values(fieldsInSubtable).filter((fieldInSubtable) =>
          supportedFieldTypesInSubtable.includes(fieldInSubtable.type)
        ),
        ...others,
      });
      continue;
    }
    fields.push(property);
  }
  return fields;
};
