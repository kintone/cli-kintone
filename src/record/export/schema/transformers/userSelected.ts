import type { SchemaTransformer } from "../";
import type { FieldsJson } from "../../../../kintone/types";
import type { FieldSchema } from "../../types/schema";

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
    // TODO: throw an Error when field is field in subtable
    if (!(field in fieldsJson.properties)) {
      throw new Error(
        `The specified field "${field}" does not exist on the app`
      );
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
