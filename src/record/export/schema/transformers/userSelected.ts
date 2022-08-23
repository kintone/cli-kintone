import type { SchemaTransformer } from "../";
import type { FieldsJson } from "../../../../kintone/types";
import type { FieldSchema } from "../../types/schema";
import { isSupportedField } from "../constants";

/**
 * This transformer returns only all supported fields.
 * This transformer sorts headerFields by the following rules.
 * - based on form layout of the kintone app
 */
export const userSelected = (
  userSelectedFields: string[],
  fieldsJson: FieldsJson
): SchemaTransformer => {
  validateFields(userSelectedFields, fieldsJson);
  return (fields: FieldSchema[]) => {
    return fields
      .filter((fieldSchema) => userSelectedFields.includes(fieldSchema.code))
      .sort(comparator(userSelectedFields));
  };
};

/**
 * throw Error on following situation
 * - given field is field in subtable
 * - given field does not found on fieldJson
 * @param fields
 * @param fieldsJson
 */
const validateFields = (fields: string[], fieldsJson: FieldsJson) => {
  for (const field of fields) {
    for (const property of Object.values(fieldsJson.properties)) {
      if (property.type === "SUBTABLE" && field in property.fields) {
        throw new Error(
          `The field in Table "${field}" cannot be specified to fields option`
        );
      }
    }
    if (!(field in fieldsJson.properties)) {
      throw new Error(
        `The specified field "${field}" does not exist on the app`
      );
    }
    if (!isSupportedField(fieldsJson.properties[field])) {
      throw new Error(`The specified field "${field}" is not supported`);
    }
  }
};

const comparator = (fields: string[]) => {
  return (a: FieldSchema, b: FieldSchema) => {
    const indexA = fields.indexOf(a.code);
    const indexB = fields.indexOf(b.code);

    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1;
    }
    return indexA - indexB;
  };
};
