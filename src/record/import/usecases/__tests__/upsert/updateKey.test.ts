import { hasAppCode } from "../../upsert/updateKey";

describe("hasAppCode", () => {
  it.each`
    input        | appCode  | result
    ${"1"}       | ${""}    | ${false}
    ${"123"}     | ${""}    | ${false}
    ${"1"}       | ${"App"} | ${false}
    ${"123"}     | ${"App"} | ${false}
    ${"App-123"} | ${"App"} | ${true}
  `(
    "should pass (input: $input, appCode: $appCode, result: $result)",
    ({
      input,
      appCode,
      result,
    }: {
      input: string;
      appCode: string;
      result: boolean;
    }) => {
      expect(hasAppCode(input, appCode)).toBe(result);
    },
  );

  it.each`
    input         | appCode
    ${"App-123"}  | ${""}
    ${"Hoge-123"} | ${""}
    ${"Hoge-123"} | ${"App"}
  `(
    "should throw with invalid error (input: $input, appCode: $appCode)",
    ({ input, appCode }: { input: string; appCode: string }) => {
      expect(() => hasAppCode(input, appCode)).toThrow(
        `The "Key to Bulk Update" value is invalid (${input})`,
      );
    },
  );
});
