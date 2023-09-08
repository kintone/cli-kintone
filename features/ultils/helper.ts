import { spawnSync } from "child_process";
import path from "path";

export const execCliKintoneSync = (
  args: string,
  options?: { env?: { [key: string]: string } },
) => {
  const response = spawnSync(getCliKintoneBinary(), args.split(/\s+/), {
    encoding: "utf-8",
    env: options?.env ?? {},
  });
  if (response.error) {
    throw response.error;
  }
  return response;
};

export const getCliKintoneBinary = (): string => {
  const dir = path.join(__dirname, "..", "..", "bin");
  switch (process.platform) {
    case "darwin":
      return path.join(dir, "cli-kintone-macos");
    case "linux":
      return path.join(dir, "cli-kintone-linux");
    case "win32":
      return path.join(dir, "cli-kintone-win.exe");
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
};

export const replaceTokenWithEnvVars = (input: string) =>
  input.replace(/\$\$[a-zA-Z0-9_]+/g, replacer);

const replacer = (substring: string) => {
  const key = substring.replace("$$", "");
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`The env variable is missing: ${key}`);
  }
  return value;
};
