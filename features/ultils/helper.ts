import type { ExecException } from "child_process";
import { exec } from "child_process";
import path from "path";

export const executeCommand = (
  cmd: string,
  throwError: boolean = true
): Promise<{ error: ExecException | null; stderr: string; stdout: string }> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error && throwError) {
        reject(error);
      } else {
        resolve({ error, stderr, stdout });
      }
    });
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
