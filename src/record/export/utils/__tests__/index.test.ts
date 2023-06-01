import { sanitizeFilename } from "../file";

describe("utils/operateFilename.ts", () => {
  it("should replace a special character", () => {
    const testFilename = ':"t/e\\|s?*t<>.txt';
    const expectedFilename = "__t_e__s__t__.txt";
    const normalizedFilename = sanitizeFilename(testFilename);
    expect(normalizedFilename).toBe(expectedFilename);
  });
});
