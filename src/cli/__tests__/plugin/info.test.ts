import { vi } from "vitest";
import { realpathSync } from "fs";
import fs from "fs/promises";
import consumers from "node:stream/consumers";
import os from "os";
import path from "path";
import yazl from "yazl";
import {
  LocalFSDriver,
  ManifestFactory,
  PluginZip,
  PrivateKey,
} from "../../../plugin/core";
import { runCli } from "../cliHelper";

const projectRoot = path.resolve(__dirname, "../../../../");

vi.setConfig({ testTimeout: 30000 });

const privateKeyPath = path.resolve(
  projectRoot,
  "src/plugin/core/crypto/__tests__/fixtures/private.ppk",
);
const pluginWithoutSandboxPath = path.resolve(
  projectRoot,
  "features/assets/plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip",
);
const sandboxManifestPath = path.resolve(
  projectRoot,
  "src/plugin/core/manifest/__tests__/fixtures/plugin-sandbox-valid/manifest.json",
);
const invalidContentsZipPath = path.resolve(
  projectRoot,
  "src/plugin/packer/__tests__/fixtures/invalid-maxFileSize-contents.zip",
);

const buildPluginWithSandbox = async (outputPath: string) => {
  const privateKey = PrivateKey.importKey(
    await fs.readFile(privateKeyPath, "utf8"),
  );
  const manifest = await ManifestFactory.loadJsonFile(sandboxManifestPath);
  const pluginZip = await PluginZip.build(
    manifest,
    privateKey,
    new LocalFSDriver(path.dirname(sandboxManifestPath)),
  );
  await fs.writeFile(outputPath, pluginZip.buffer);
};

// PluginZip.build validates the manifest, so a plugin with an invalid manifest is zipped by hand.
const buildPluginWithInvalidManifest = async (outputPath: string) => {
  const privateKey = PrivateKey.importKey(
    await fs.readFile(privateKeyPath, "utf8"),
  );
  const contentsZip = await fs.readFile(invalidContentsZipPath);
  const zipFile = new yazl.ZipFile();
  zipFile.addBuffer(contentsZip, "contents.zip");
  zipFile.addBuffer(privateKey.exportPublicKey(), "PUBKEY");
  zipFile.addBuffer(privateKey.sign(contentsZip), "SIGNATURE");
  zipFile.end();
  await fs.writeFile(outputPath, await consumers.buffer(zipFile.outputStream));
};

describe("plugin info", () => {
  let workDir: string;
  let pluginWithSandboxPath: string;
  let pluginWithInvalidManifestPath: string;

  beforeAll(async () => {
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-info-"),
    );
    workDir = realpathSync.native(tempDir);
    pluginWithSandboxPath = path.join(workDir, "sandbox.zip");
    pluginWithInvalidManifestPath = path.join(workDir, "invalid-manifest.zip");
    await buildPluginWithSandbox(pluginWithSandboxPath);
    await buildPluginWithInvalidManifest(pluginWithInvalidManifestPath);
  });

  afterAll(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should print the plugin without sandbox in plain", async () => {
    const result = await runCli(
      ["plugin", "info", "--input", pluginWithoutSandboxPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: [
        "id: chjjmgadianhfiopehkbjlfkfioglafk",
        "name: hello-kintone",
        "version: 1",
        "description: Description of hello-kintone in English.",
        "homepage: https://example.com/en/",
        "",
      ].join("\n"),
      stderr: "",
    });
  });

  it("should print the plugin without sandbox in json", async () => {
    const result = await runCli(
      [
        "plugin",
        "info",
        "--input",
        pluginWithoutSandboxPath,
        "--format",
        "json",
      ],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: [
        "{",
        '  "id": "chjjmgadianhfiopehkbjlfkfioglafk",',
        '  "name": "hello-kintone",',
        '  "version": 1,',
        '  "description": "Description of hello-kintone in English.",',
        '  "homepage": "https://example.com/en/"',
        "}",
        "",
      ].join("\n"),
      stderr: "",
    });
  });

  it("should print the plugin with sandbox in plain", async () => {
    const result = await runCli(
      ["plugin", "info", "--input", pluginWithSandboxPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: [
        "id: ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj",
        "name: sandbox sample",
        "version: 1",
        "description: (not set)",
        "homepage: (not set)",
        "sandbox: true",
        "allowed_hosts: https://example.com, wss://example.com, https://example.com/api/*, *",
        "permissions: app:read, network:connect, app_record:read:self, file:write",
        "",
      ].join("\n"),
      stderr: "",
    });
  });

  it("should print the plugin with sandbox in json", async () => {
    const result = await runCli(
      ["plugin", "info", "--input", pluginWithSandboxPath, "--format", "json"],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: [
        "{",
        '  "id": "ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj",',
        '  "name": "sandbox sample",',
        '  "version": 1,',
        '  "sandbox": true,',
        '  "allowed_hosts": [',
        '    "https://example.com",',
        '    "wss://example.com",',
        '    "https://example.com/api/*",',
        '    "*"',
        "  ],",
        '  "permissions": [',
        "    {",
        '      "permission": "app:read"',
        "    },",
        "    {",
        '      "permission": "network:connect"',
        "    },",
        "    {",
        '      "permission": "app_record:read",',
        '      "scope": "self"',
        "    },",
        "    {",
        '      "permission": "file:write"',
        "    }",
        "  ]",
        "}",
        "",
      ].join("\n"),
      stderr: "",
    });
  });

  it("should fail when the plugin file does not exist", async () => {
    const inputPath = path.join(workDir, "none.zip");

    const result = await runCli(
      ["plugin", "info", "--input", inputPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Error: ENOENT: no such file or directory, open '${inputPath}'\n`,
    });
  });

  it("should fail when the plugin file is not a zip file", async () => {
    const inputPath = path.join(workDir, "broken.zip");
    await fs.writeFile(inputPath, "not a zip file", "utf8");

    const result = await runCli(
      ["plugin", "info", "--input", inputPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr:
        "ERROR: Error: End of central directory record signature not found. Either not a zip file, or file is truncated.\n",
    });
  });

  it("should fail when the manifest of the plugin is invalid", async () => {
    const result = await runCli(
      ["plugin", "info", "--input", pluginWithInvalidManifestPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: 'ERROR: Error: "/icon" file size should be <= 20MB\n',
    });
  });
});
