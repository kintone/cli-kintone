import type { SchemaTransformer } from "../index";
import type { FieldSchema } from "../../types/schema";

export const noop = (): SchemaTransformer => (fields: FieldSchema[]) => fields;
