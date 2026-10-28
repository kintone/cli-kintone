import { vi } from "vitest";
import { realpathSync } from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { PluginZip } from "../../../plugin/core";
import { runCli } from "../cliHelper";

const projectRoot = path.resolve(__dirname, "../../../../");

vi.setConfig({ testTimeout: 30000 });

const pluginProjectPath = path.resolve(
  projectRoot,
  "features/assets/plugin_project",
);

// The pack handler only prints its arguments when NODE_ENV is "test", which vitest sets.
const env = { ...process.env, NODE_ENV: "production" };

// The message of JSON.parse differs between Node.js versions, so the CLI test runs the same parse to get the expected one.
const parseErrorMessage = (json: string): string => {
  try {
    JSON.parse(json);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return e.message;
    }
  }
  throw new Error(`JSON.parse did not throw a SyntaxError for ${json}`);
};

const copyDirectory = async (source: string, destination: string) => {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
};

const readPluginId = async (pluginPath: string) => {
  const pluginZip = await PluginZip.fromBuffer(await fs.readFile(pluginPath));
  return pluginZip.getPluginID();
};

describe("plugin pack", () => {
  let workDir: string;
  let manifestPath: string;
  let privateKeyPath: string;

  beforeEach(async () => {
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-pack-"),
    );
    // The CLI prints the absolute path resolved from its cwd, so compare it with the real path.
    workDir = realpathSync.native(tempDir);
    await copyDirectory(pluginProjectPath, path.join(workDir, "src"));
    manifestPath = path.join(workDir, "src", "manifest.json");
    privateKeyPath = path.join(workDir, "src", "private.ppk");
  });

  afterEach(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  const writeManifest = async (
    update: (manifest: Record<string, unknown>) => void,
  ) => {
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    update(manifest);
    await fs.writeFile(manifestPath, JSON.stringify(manifest), "utf8");
  };

  it("should write plugin.zip to the current directory by default", async () => {
    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        "src/manifest.json",
        "--private-key",
        "src/private.ppk",
      ],
      workDir,
      env,
    );

    const outputPath = path.join(workDir, "plugin.zip");
    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: The plugin file generated: ${outputPath}\n`,
    });
    await expect(readPluginId(outputPath)).resolves.toBe(
      "chjjmgadianhfiopehkbjlfkfioglafk",
    );
  });

  it("should write plugin.zip to the current directory when the output is empty", async () => {
    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        manifestPath,
        "--private-key",
        privateKeyPath,
        "--output",
        "",
      ],
      workDir,
      env,
    );

    const outputPath = path.join(workDir, "plugin.zip");
    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: The plugin file generated: ${outputPath}\n`,
    });
    await expect(readPluginId(outputPath)).resolves.toBe(
      "chjjmgadianhfiopehkbjlfkfioglafk",
    );
  });

  it("should create the directory of the output path", async () => {
    const outputPath = path.join(workDir, "dist", "nested", "plugin.zip");

    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        manifestPath,
        "--private-key",
        privateKeyPath,
        "--output",
        outputPath,
      ],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: The plugin file generated: ${outputPath}\n`,
    });
    await expect(readPluginId(outputPath)).resolves.toBe(
      "chjjmgadianhfiopehkbjlfkfioglafk",
    );
  });

  it("should print the warnings of the manifest and write the plugin", async () => {
    await writeManifest((manifest) => {
      manifest.homepage_url = { en: "https://example.com/en/" };
    });
    const outputPath = path.join(workDir, "plugin.zip");

    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        manifestPath,
        "--private-key",
        privateKeyPath,
      ],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: [
        'WARN: Property "homepage_url.ja" is missing.',
        'WARN: Property "homepage_url.zh" is missing.',
        'WARN: Property "homepage_url.es" is missing.',
        `INFO: The plugin file generated: ${outputPath}`,
        "",
      ].join("\n"),
    });
  });

  it("should fail when the manifest file does not exist", async () => {
    const inputPath = path.join(workDir, "none", "manifest.json");

    const result = await runCli(
      ["plugin", "pack", "--input", inputPath, "--private-key", privateKeyPath],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Error: Manifest file not found: ${inputPath}\n`,
    });
  });

  it("should fail when the private key file does not exist", async () => {
    const keyPath = path.join(workDir, "none.ppk");

    const result = await runCli(
      ["plugin", "pack", "--input", manifestPath, "--private-key", keyPath],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Error: Private key file not found: ${keyPath}\n`,
    });
  });

  it("should fail when the manifest file is not JSON", async () => {
    await fs.writeFile(manifestPath, "{bad", "utf8");

    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        manifestPath,
        "--private-key",
        privateKeyPath,
      ],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: SyntaxError: ${parseErrorMessage("{bad")}\n`,
    });
  });

  it("should fail with the errors and the warnings when the manifest is invalid", async () => {
    await writeManifest((manifest) => {
      manifest.homepage_url = {
        en: "https://example.com/en/",
        ja: "https://example.com/ja/",
        zh: "https://example.com/zh/",
      };
      manifest.icon = "image/none.png";
    });
    const iconPath = path.join(workDir, "src", "image", "none.png");

    const result = await runCli(
      [
        "plugin",
        "pack",
        "--input",
        manifestPath,
        "--private-key",
        privateKeyPath,
      ],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: [
        'WARN: Property "homepage_url.es" is missing.',
        "ERROR: Invalid manifest.json:",
        `ERROR: - "/icon" Error: ENOENT: no such file or directory, stat '${iconPath}'`,
        `ERROR: - "/icon" Error: ENOENT: no such file or directory, stat '${iconPath}'`,
        'ERROR: - "/icon" must match format "relative-path"',
        "ERROR: Error: Invalid manifest.json",
        "",
      ].join("\n"),
    });
    await expect(fs.stat(path.join(workDir, "plugin.zip"))).rejects.toThrow(
      "ENOENT",
    );
  });
});
