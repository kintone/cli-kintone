import type { OneOf } from "./field";

export type KintoneRecord = {
  data: { [fieldCode: string]: OneOf };
  metadata: {
    format: {
      type: "csv";
      firstRowIndex: number;
      lastRowIndex: number;
    };
  };
};
