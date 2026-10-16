import os from "os";
import type { ChokidarOptions } from "chokidar";

export const buildWatchOptions = (
  platform: NodeJS.Platform = os.platform(),
): ChokidarOptions => {
  // Windows fires change events before the file is fully written,
  // so wait for writes to finish there.
  if (platform === "win32") {
    return {
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 250,
      },
    };
  }
  return {};
};
