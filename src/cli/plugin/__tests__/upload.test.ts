import { vi } from "vitest";
import yargsFactory from "yargs";
import { upload } from "../../../plugin/upload";
import { uploadCommand } from "../upload";

vi.mock("../../../plugin/upload");

const parse = (args: string[]) =>
  yargsFactory([
    "upload",
    "--input",
    "plugin.zip",
    "--yes",
    "--base-url",
    "https://example.kintone.com",
    "--username",
    "user",
    "--password",
    "pass",
    ...args,
  ])
    .command(uploadCommand)
    .exitProcess(false)
    .fail((msg, err) => {
      throw err || new Error(msg);
    })
    .parseAsync();

describe("plugin upload command", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should pass the options to upload", async () => {
    await parse([]);

    expect(upload).toHaveBeenCalledWith(
      expect.objectContaining({
        pluginFilePath: "plugin.zip",
        force: true,
        watch: false,
        baseUrl: "https://example.kintone.com",
        username: "user",
        password: "pass",
      }),
    );
  });

  // Plugins are installed regardless of guest spaces, so the hidden --guest-space-id is ignored.
  it("should ignore the hidden --guest-space-id", async () => {
    await parse(["--guest-space-id", "1"]);

    expect(upload).toHaveBeenCalledOnce();
    expect(vi.mocked(upload).mock.calls[0][0]).not.toHaveProperty(
      "guestSpaceId",
    );
  });
});
