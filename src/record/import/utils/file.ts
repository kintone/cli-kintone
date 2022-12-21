import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { Readable } from "stream";
import type { ReadableStream } from "stream/web";

export type SupportedImportEncoding = "utf8" | "sjis";

export const readFileStream: (
  filePath: string,
  encoding?: SupportedImportEncoding
) => { content: ReadableStream<string>; format: string } = (
  filePath,
  encoding = "utf8"
) => {
  const format = extractFileFormat(filePath);
  if (format === "json" && encoding !== "utf8") {
    throw new Error("source file is JSON and JSON MUST be encoded with UTF-8");
  }
  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream(encoding));
  const readable = new Readable().wrap(stream);
  const webStream: ReadableStream<string> = Readable.toWeb(readable);

  return { content: webStream, format };
};

const extractFileFormat: (filepath: string) => string = (filepath) => {
  // TODO this cannot detect file format without extensions
  return path.extname(filepath).split(".").pop() || "";
};
