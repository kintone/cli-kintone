import { OneOf } from "./field";

export type KintoneRecord = {
  data: { [fieldCode: string]: OneOf };
  metadata: {
    csv?: {
      firstRowIndex: number;
      lastRowIndex: number;
    };
  };
};
