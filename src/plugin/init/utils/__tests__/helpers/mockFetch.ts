/* eslint-disable n/no-unsupported-features/node-builtins */
import { Readable } from "stream";
import { readFile } from "fs/promises";
import { join } from "path";

export const mockFetchWithTarball = async (
  templateName: "javascript" | "typescript",
) => {
  const tarballPath = join(
    __dirname,
    "..",
    "fixtures",
    `${templateName}-template.tar.gz`,
  );
  const tarballBuffer = await readFile(tarballPath);

  // Node.js ReadableをWeb ReadableStreamに変換
  const nodeStream = Readable.from(tarballBuffer);
  const webStream = Readable.toWeb(nodeStream);

  (global.fetch as jest.Mock).mockResolvedValue({
    body: webStream,
  });
};

export const mockFetchSuccess = () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 200,
  });
};

export const mockFetchNotFound = () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 404,
  });
};

export const mockFetchError = () => {
  (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
};
