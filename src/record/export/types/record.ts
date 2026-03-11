import type { OneOf } from "./field.js";

export type LocalRecord = {
  [fieldCode: string]: OneOf;
};
