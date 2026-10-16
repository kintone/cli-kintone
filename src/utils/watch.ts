import os from "os";
import type { ChokidarOptions } from "chokidar";

export const buildWatchOptions = (
  platform: NodeJS.Platform = os.platform(),
): ChokidarOptions => {
  // change events are fired before changed files are flushed on Windows,
  // which generate an invalid plugin zip.
  // in order to fix this, we use awaitWriteFinish option only on Windows.
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
