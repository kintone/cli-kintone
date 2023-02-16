import fs from "fs";
import path from "path";
import iconv from "iconv-lite";
import { Transform } from "stream";

export type SupportedImportEncoding = "utf8" | "sjis";

export const openFsStreamWithEncode: (
  filePath: string,
  encoding?: SupportedImportEncoding
) => NodeJS.ReadableStream = (filePath, encoding = "utf8") => {
  const stream = fs.createReadStream(filePath);
  const decodedStream = stream.pipe(
    Transform.from(iconv.decodeStream(encoding))
  );
  stream.on("error", (e) => {
    decodedStream.destroy(e);
  });
  return decodedStream;
};

export const readFile: (
  filePath: string,
  encoding?: SupportedImportEncoding
) => Promise<{ content: string; format: string }> = async (
  filePath,
  encoding = "utf8"
) => {
  const format = extractFileFormat(filePath);
  if (format === "json" && encoding !== "utf8") {
    throw new Error("source file is JSON and JSON MUST be encoded with UTF-8");
  }

  return new Promise((resolve, reject) => {
    (async () => {
      const stream = fs.createReadStream(filePath);
      stream.on("error", reject);

      const readWriteStream = stream.pipe(iconv.decodeStream(encoding));
      const content = await readStream(readWriteStream);
      resolve({ content, format });
    })();
  });
};

const readStream: (stream: NodeJS.ReadWriteStream) => Promise<string> = async (
  stream
) => {
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
};

export const extractFileFormat: (filepath: string) => string = (filepath) => {
  // TODO this cannot detect file format without extensions
  return path.extname(filepath).split(".").pop() || "";
};
