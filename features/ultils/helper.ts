import { spawnSync } from "child_process";
import path from "path";

export const execCliKintoneSync = (args: string) => {
  return spawnSync(getCliKintoneBinary(), args.split(" "), {
    encoding: "utf-8",
  });
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
  input
    .replace("KINTONE_BASE_URL", process.env.KINTONE_BASE_URL ?? "")
    .replace("KINTONE_API_TOKEN", process.env.KINTONE_API_TOKEN ?? "")
    .replace("KINTONE_APP_ID", process.env.KINTONE_APP_ID ?? "");
