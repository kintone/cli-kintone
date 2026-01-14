import assert from "assert";
import fs from "fs";
import { rimrafSync } from "rimraf";
import type { CustomizeManifest } from "../../core";
import { generateCustomizeManifest, getInitCustomizeManifest } from "../index";

describe("init", () => {
  const testDestDir = "testDestDir";

  describe("runInit", () => {
    afterEach(() => {
      rimrafSync(`${testDestDir}`);
    });

    const assertManifestContent = (buffer: Buffer) => {
      const appCustomize = JSON.parse(
        fs
          .readFileSync(
            "src/customize/__tests__/fixtures/get-appcustomize-init.json",
          )
          .toString(),
      );
      assert.deepStrictEqual(JSON.parse(buffer.toString()), appCustomize);
    };

    it("should success generating customize-manifest.json", async () => {
      const outputPath = `${testDestDir}/customize-manifest.json`;
      const manifestFileContent: CustomizeManifest =
        getInitCustomizeManifest("ALL");
      await generateCustomizeManifest(manifestFileContent, outputPath);
      const content = fs.readFileSync(outputPath);
      assertManifestContent(content);
      assert.ok(fs.existsSync(outputPath), `test ${outputPath} exists`);
    });
  });
});
