import assert from "assert";
import { isUrlString } from "../util";

describe("util", () => {
  describe("isUrlString", () => {
    it("should return true if the string is URL", () => {
      assert(isUrlString("https://example.com") === true);
      assert(isUrlString("http://localhost:8000") === true);
    });
    it("should return false if the string is not URL", () => {
      assert(isUrlString("example.com") === false);
      assert(isUrlString("js/desktop.js") === false);
    });
  });
});
