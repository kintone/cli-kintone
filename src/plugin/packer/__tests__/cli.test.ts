import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";
import { globSync } from "glob";
import cli from "../cli";
import { logger } from "../../../utils/log";
import type { ContentsZipInterface } from "../contents-zip";
import type { PluginZipInterface } from "../plugin-zip";
import { ZipFile } from "../zip";

type MockedPacker = jest.MockedFunction<
  (
    contentsZip: ContentsZipInterface,
    privateKey_?: string,
  ) => Promise<{ plugin: PluginZipInterface; privateKey: string; id: string }>
>;

class MockPluginZip extends ZipFile implements PluginZipInterface {}

const fixturesDir = path.posix.join(__dirname, "fixtures");
const sampleDir = path.posix.join(fixturesDir, "sample-plugin");
const ppkPath = path.posix.join(fixturesDir, "private.ppk");

const ID = "aaa";
const PRIVATE_KEY = "PRIVATE_KEY";
const PLUGIN_ZIP = new MockPluginZip(Buffer.from("foo"));

describe("cli", () => {
  beforeEach(() => {
    logger.setLogConfigLevel("none");
  });
  afterEach(() => {
    logger.setLogConfigLevel("info");
  });

  it("is a function", () => {
    expect(typeof cli).toBe("function");
  });

  describe("validation", () => {
    let packer: MockedPacker;
    beforeEach(() => {
      packer = jest.fn();
      packer.mockResolvedValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_ZIP,
      });
    });

    it("invalid `url`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-url"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `https-url`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-https-url"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `relative-path`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-relative-path"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `maxFileSize`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-maxFileSize"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `fileExists`", (done) => {
      cli(path.join(fixturesDir, "plugin-non-file-exists"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });
  });

  describe("without ppk", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    let packer: MockedPacker;
    let resultPluginPath: string;

    beforeEach(async () => {
      packer = jest.fn();
      packer.mockResolvedValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_ZIP,
      });

      // TODO: use os tempdir
      await rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true });
      resultPluginPath = await cli(pluginDir, { packerMock_: packer });
    });

    it("calles `packer` with contents.zip as the 1st argument", async () => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][0]).toBeTruthy();

      const files = await packer.mock.calls[0][0].fileList();
      expect(files.sort()).toStrictEqual(
        ["image/icon.png", "manifest.json"].sort(),
      );
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][1]).toBe(undefined);
    });

    it("generates a private key file", () => {
      const privateKey = fs.readFileSync(
        path.join(sampleDir, `${ID}.ppk`),
        "utf8",
      );
      expect(privateKey).toBe(PRIVATE_KEY);
    });

    it("generates a plugin file", () => {
      const pluginBuffer = fs.readFileSync(resultPluginPath);
      expect(PLUGIN_ZIP.buffer.equals(pluginBuffer)).toBe(true);
    });
  });

  describe("with ppk", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    let packer: MockedPacker;
    beforeEach(async () => {
      packer = jest.fn();
      packer.mockResolvedValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_ZIP,
      });

      await rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true });
      return cli(pluginDir, { ppk: ppkPath, packerMock_: packer });
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      const ppkFile = fs.readFileSync(ppkPath, "utf8");
      expect(packer.mock.calls[0][1]).toBe(ppkFile);
    });

    it("does not generate a private key file", () => {
      const ppkFiles = globSync(`${sampleDir}/*.ppk`);
      expect(ppkFiles).toStrictEqual([]);
    });
  });

  it("includes files listed in manifest.json only", async () => {
    const pluginDir = path.join(fixturesDir, "plugin-full-manifest");
    const packer: MockedPacker = jest.fn();
    packer.mockResolvedValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_ZIP,
    });

    await rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true });
    await cli(pluginDir, { packerMock_: packer });
    const files = await packer.mock.calls[0][0].fileList();
    expect(files.sort()).toStrictEqual(
      [
        "css/config.css",
        "css/desktop.css",
        "css/mobile.css",
        "html/config.html",
        "image/icon.png",
        "js/config.js",
        "js/desktop.js",
        "js/mobile.js",
        "manifest.json",
      ].sort(),
    );
  });

  it("includes files listed in manifest.json only", async () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    const outputDir = path.join("test", ".output");
    const outputPluginPath = path.join(outputDir, "foo.zip");
    const packer: MockedPacker = jest.fn();
    packer.mockResolvedValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_ZIP,
    });

    await rimraf(outputDir);
    const resultPluginPath = await cli(pluginDir, {
      packerMock_: packer,
      out: outputPluginPath,
    });

    expect(resultPluginPath).toBe(outputPluginPath);
    const pluginBuffer = fs.readFileSync(outputPluginPath);
    expect(PLUGIN_ZIP.buffer.equals(pluginBuffer)).toBe(true);
    const ppk = fs.readFileSync(path.join(outputDir, `${ID}.ppk`));
    expect(PRIVATE_KEY).toBe(ppk.toString());

    // TODO: use os tempdir for more safe testing
    await rimraf(outputDir);
  });
});
