import path from "path";
import { ManifestFactory } from "../factory";
import { LocalFSDriver } from "../../driver";

const fixturesDir = path.posix.join(__dirname, "fixtures");

describe("validate", () => {
  const cases = [
    {
      name: "`url`",
      dir: "plugin-invalid-url",
    },
    {
      name: "`https-url`",
      dir: "plugin-invalid-https-url",
    },
    {
      name: "`relative-path`",
      dir: "plugin-invalid-relative-path",
    },
    {
      name: "`maxFileSize`",
      dir: "plugin-invalid-maxFileSize",
    },
    {
      name: "`fileExists`",
      dir: "plugin-non-file-exists",
    },
  ];

  it.each(cases)("invalid $name", async ({ dir }) => {
    const manifestFilePath = path.join(fixturesDir, dir, "manifest.json");

    const manifest = await ManifestFactory.loadJsonFile(manifestFilePath);
    const driver = new LocalFSDriver(path.dirname(manifestFilePath));
    const result = await manifest.validate(driver);

    expect(result.valid).toBe(false);
  });
});
