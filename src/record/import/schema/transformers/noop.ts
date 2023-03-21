import type { SchemaTransformer } from "../index.js";
import type { FieldSchema } from "../../types/schema.js";

export const noop = (): SchemaTransformer => (fields: FieldSchema[]) => fields;
