import path from "path";
import { ManifestFactory } from "../factory";
import { LocalFSDriver } from "../../driver";

const fixturesDir = path.posix.join(__dirname, "fixtures");

describe("validate", () => {
  const cases = [
    {
      name: "`url`",
      dir: "plugin-invalid-url",
      expected: false,
    },
    {
      name: "`https-url`",
      dir: "plugin-invalid-https-url",
      expected: false,
    },
    {
      name: "`relative-path`",
      dir: "plugin-invalid-relative-path",
      expected: false,
    },
    {
      name: "`maxFileSize`",
      dir: "plugin-invalid-maxFileSize",
      expected: false,
    },
    {
      name: "`fileExists`",
      dir: "plugin-non-file-exists",
      expected: false,
    },
    {
      name: "`valid-locales-v1`",
      dir: "plugin-locales/v1/valid-locales",
      expected: true,
    },
    {
      name: "`invalid-locales-v1`",
      dir: "plugin-locales/v1/invalid-locales",
      expected: false,
    },
    // TODO : Validation for v2 is not yet implemented. see src/plugin/core/manifest/v2/index.ts
    // {
    //   name: "`valid-locales-v2`",
    //   dir: "plugin-locales/v2/valid-locales",
    //   expected: true,
    // },
    // {
    //   name: "`invalid-locales-v2`",
    //   dir: "plugin-locales/v2/invalid-locales",
    //   expected: false,
    // },
  ];

  it.each(cases)("$name", async ({ dir, expected }) => {
    const manifestFilePath = path.join(fixturesDir, dir, "manifest.json");

    const manifest = await ManifestFactory.loadJsonFile(manifestFilePath);
    const driver = new LocalFSDriver(path.dirname(manifestFilePath));
    const result = await manifest.validate(driver);

    expect(result.valid).toBe(expected);
  });
});
