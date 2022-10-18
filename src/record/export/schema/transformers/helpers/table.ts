import type { FieldSchema } from "../../../types/schema";
import type { LayoutJson } from "../../../../../kintone/types";
import type { KintoneFormLayout } from "@kintone/rest-api-client";

export const tableLayoutComparator = (
  fieldCode: string,
  layoutJson: LayoutJson
): ((fieldA: FieldSchema, fieldB: FieldSchema) => number) => {
  const tableField = layoutJson.layout.find(
    (
      row
    ): row is KintoneFormLayout.Subtable<
      KintoneFormLayout.Field.InSubtable[]
    > => row.type === "SUBTABLE" && row.code === fieldCode
  );

  return (fieldA, fieldB) => {
    if (!tableField) {
      return 0;
    }

    const indexA = tableField.fields.findIndex(
      (field) => field.code === fieldA.code
    );
    const indexB = tableField.fields.findIndex(
      (field) => field.code === fieldB.code
    );

    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1;
    }
    return indexA - indexB;
  };
};
