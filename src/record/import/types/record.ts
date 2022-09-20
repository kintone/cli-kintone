import { OneOf } from "./field";

export type KintoneRecord = {
  data: { [fieldCode: string]: OneOf };
  metadata: {
    csv?: {
      lineFirst: number;
      lineLast: number;
    };
  };
};
