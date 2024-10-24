import path from "path";
import type { ExecaMethod } from "execa";
import pkg from "../../../../package.json";

// TODO: Remove this test file
const execa = {} as ExecaMethod<{}>;

describe.skip("bin", () => {
  it("should output version with --version", async () => {
    const result = await exec("--version");
    expect(result.stdout).toBe(pkg.version);
  });

  it("should fail without args", () =>
    exec().then(
      () => {
        throw new Error("should be rejected");
      },
      (result) => {
        expect(/An argument `PLUGIN_DIR` is required/.test(result.stderr)).toBe(
          true,
        );
      },
    ));

  it("should recieve 1st arg as PLUGIN_DIR", async () => {
    const result = await exec("foo");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: false },
    });
  });

  it("should recieve --ppk", async () => {
    const result = await exec("foo", "--ppk", "bar");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: false, ppk: "bar" },
    });
  });

  it("should recieve --out", async () => {
    const result = await exec("foo", "--out", "bar");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: false, out: "bar" },
    });
  });

  it("should recieve --watch", async () => {
    const result = await exec("foo", "--watch");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: true },
    });
  });

  it("should recieve -w as an alias of --watch", async () => {
    const result = await exec("foo", "-w");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: true },
    });
  });

  it("should filter unexpected option", async () => {
    const result = await exec("foo", "--bar");
    expect(JSON.parse(result.stdout)).toStrictEqual({
      pluginDir: "foo",
      flags: { watch: false },
    });
  });
});

const exec = async (...args: string[]) => {
  const binPath = path.resolve(__dirname, "../bin/cli.js");
  const env = Object.assign({}, process.env, { NODE_ENV: "test" });
  return execa(binPath, args, { env });
};
