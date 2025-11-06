import { generateFile } from "../fileGenerator";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { rimraf } from "rimraf";

describe("File Generator functions", () => {
  describe("Generate file success", () => {
    let tempDir: string;
    beforeEach(async () => {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-kintone-"));
    });

    it("should generate file correctly", async () => {
      const filePath = path.join(tempDir, "/tmp/test.png");
      await generateFile(filePath, {});

      const stats = await fs.stat(filePath);
      expect(stats.isFile()).toBeTruthy();
    });

    it("should generate file correctly with baseDir", async () => {
      const filePath = "test.png";
      const baseDir = path.join(tempDir, "./tmp");
      await generateFile(filePath, { baseDir });

      const stats = await fs.stat(`${baseDir}/${filePath}`);
      expect(stats.isFile()).toBeTruthy();
    });

    afterEach(() => {
      rimraf.sync(tempDir);
    });
  });

  it("should throw error when generating unsupported file extension", async () => {
    const filePath = "test.xlsx";
    await expect(generateFile(filePath, {})).rejects.toThrow(
      `File extension "xlsx" is not supported`,
    );
  });

  it("should throw error when file path is invalid", async () => {
    const filePath = "test";
    await expect(generateFile(filePath, {})).rejects.toThrow(
      `Invalid file path "${filePath}".`,
    );
  });
});
