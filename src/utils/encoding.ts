import fs from "fs";
import iconv from "iconv-lite";
import readline from "readline";
import { extractFileFormat } from "./file";
import type { SupportedImportEncoding } from "./file";

export const isMismatchEncoding = async (
  filePath: string,
  encoding: SupportedImportEncoding,
): Promise<boolean> => {
  const format = extractFileFormat(filePath);
  switch (format) {
    case "csv":
      return isMismatchEncodingOfCsvFile(filePath, encoding);
  }

  return false;
};

const isMismatchEncodingOfCsvFile: (
  filePath: string,
  encoding: SupportedImportEncoding,
) => Promise<boolean> = async (filePath, encoding) => {
  const decodedFirstLine = await getDecodedFirstLine(filePath, encoding);
  return containsUntranslatableChars(decodedFirstLine);
};

const getDecodedFirstLine: (
  filePath: string,
  encoding: SupportedImportEncoding,
) => Promise<string> = async (filePath, encoding) => {
  const stream = fs.createReadStream(filePath);
  const readWriteStream = stream.pipe(iconv.decodeStream(encoding));
  const reader = readline.createInterface({
    input: readWriteStream,
  });

  return new Promise((resolve, reject) => {
    reader.on("line", (line: string) => {
      reader.close();
      resolve(line);
    });

    reader.on("error", reject);
    stream.on("error", reject);
  });
};

const containsUntranslatableChars: (content: string) => boolean = (content) => {
  const untranslatableChars = ["�", "?"];
  return untranslatableChars.some((char) => content.includes(char));
};
