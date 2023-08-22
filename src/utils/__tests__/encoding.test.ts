import { isMismatchEncoding } from "../encoding";
import path from "path";

describe("isMismatchEncoding", () => {
  it("should detect the mismatch encoding correctly", async () => {
    const inputSJISFile = path.join(__dirname, "./fixtures/input_sjis.csv");
    expect(await isMismatchEncoding(inputSJISFile, "sjis")).toBe(false);
    expect(await isMismatchEncoding(inputSJISFile, "utf8")).toBe(true);

    const inputUTF8File = path.join(__dirname, "./fixtures/input_utf8.csv");
    expect(await isMismatchEncoding(inputUTF8File, "sjis")).toBe(true);
    expect(await isMismatchEncoding(inputUTF8File, "utf8")).toBe(false);
  });
});
