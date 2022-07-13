import { FieldProperties } from "../../../../kintone/types";

export const hasSubtable: (fieldProperties: FieldProperties) => boolean = (
  fieldProperties
) =>
  Object.values(fieldProperties).some(
    (fieldProperty) => fieldProperty.type === "SUBTABLE"
  );
