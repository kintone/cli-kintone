import { spawnSync } from "child_process";
import path from "path";

export const execCliKintoneSync = (args: string) => {
  return spawnSync(getCliKintoneBinary(), args.split(/\s+/), {
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
    .replace("TEST_KINTONE_BASE_URL", process.env.TEST_KINTONE_BASE_URL ?? "")
    .replace("TEST_KINTONE_API_TOKEN", process.env.TEST_KINTONE_API_TOKEN ?? "")
    .replace("TEST_KINTONE_APP_ID", process.env.TEST_KINTONE_APP_ID ?? "")
    .replace("TEST_KINTONE_USERNAME", process.env.TEST_KINTONE_USERNAME ?? "")
    .replace("TEST_KINTONE_PASSWORD", process.env.TEST_KINTONE_PASSWORD ?? "")
    .replace(
      "TEST_KINTONE_GUEST_SPACE_ID",
      process.env.TEST_KINTONE_GUEST_SPACE_ID ?? "",
    );
