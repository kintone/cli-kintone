import { isMismatchEncoding } from "../encoding";
import path from "path";

describe("isMismatchEncoding", () => {
  it("should detect the mismatch encoding correctly", async () => {
    const inputFilePath = path.join(__dirname, "./fixtures/input_sjis.csv");
    expect(await isMismatchEncoding(inputFilePath, "sjis")).toBe(false);
    expect(await isMismatchEncoding(inputFilePath, "utf8")).toBe(true);
  });
});
