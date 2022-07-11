import { OneOf } from "./field";

export type KintoneRecord = {
  [fieldCode: string]: OneOf;
};
