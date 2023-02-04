import type { OneOf } from "./field";

export type LocalRecord = {
  data: { [fieldCode: string]: OneOf };
  metadata: {
    recordIndex: number;
    format: {
      type: "csv";
      firstRowIndex: number;
      lastRowIndex: number;
    };
  };
};
