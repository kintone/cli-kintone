/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Mock } from "vitest";
import { Readable } from "stream";
import { join } from "path";
import { c as createTar } from "tar";

/**
 * Generate tarball dynamically from plugin-templates in the repository and mock fetch
 * Adds cli-kintone-main/ prefix to reproduce GitHub tarball format
 */
export const mockFetchWithTarball = async (
  templateName: "javascript" | "typescript",
) => {
  // plugin-templates directory at repository root
  const repoRoot = join(__dirname, "..", "..", "..", "..", "..", "..");
  const templatesDir = join(repoRoot, "plugin-templates");

  // Generate tar stream
  // GitHub tarball format is: cli-kintone-[hash]/plugin-templates/[templateName]/
  const tarStream = createTar(
    {
      gzip: true,
      cwd: templatesDir,
      prefix: `cli-kintone-main/plugin-templates`,
    },
    [templateName],
  );

  // Convert Pack stream to regular Readable, then to Web ReadableStream
  const nodeReadable = Readable.from(tarStream);
  const webStream = Readable.toWeb(nodeReadable);

  (global.fetch as Mock).mockResolvedValue({
    body: webStream,
  });
};

export const mockFetchSuccess = () => {
  (global.fetch as Mock).mockResolvedValue({
    status: 200,
  });
};

export const mockFetchNotFound = () => {
  (global.fetch as Mock).mockResolvedValue({
    status: 404,
  });
};

export const mockFetchError = () => {
  (global.fetch as Mock).mockRejectedValue(new Error("Network error"));
};
