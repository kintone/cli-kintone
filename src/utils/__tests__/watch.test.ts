import { buildWatchOptions } from "../watch";

describe("buildWatchOptions", () => {
  it("should wait for writes to finish on Windows", () => {
    expect(buildWatchOptions("win32")).toStrictEqual({
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 250,
      },
    });
  });

  it.each<NodeJS.Platform>(["linux", "darwin"])(
    "should return no options on %s",
    (platform) => {
      expect(buildWatchOptions(platform)).toStrictEqual({});
    },
  );
});
