import type { OneOf } from "./field.js";

export type KintoneRecord = {
  [fieldCode: string]: OneOf;
};
