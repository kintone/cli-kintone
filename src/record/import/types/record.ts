import type { OneOf } from "./field.js";

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
