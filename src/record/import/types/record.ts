import type { OneOf } from "./field";

export type LocalRecord = {
  data: { [fieldCode: string]: OneOf };
  metadata: {
    format: {
      type: "csv";
      firstRowIndex: number;
      lastRowIndex: number;
    };
  };
};
