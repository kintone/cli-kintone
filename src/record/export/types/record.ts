import type { OneOf } from "./field";

export type LocalRecord = {
  [fieldCode: string]: OneOf;
};
