import fs from "fs/promises";
import path from "path";
import iconv from "iconv-lite";
import type { SupportedEncoding } from "./helper";

const BASE64_CONTENT_FILES = {
  txt: "VGhpcyBpcyBhIHRlc3QgZmlsZQ==",
  png: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO3gAAAABJRU5ErkJggg==",
  jpg: "/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIABQAFAMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAHCAYJ/9oACAEBAAAAAOf9pIxyL5u0otOf/8QAFgEBAQEAAAAAAAAAAAAAAAAABQAD/9oACAECEAAAAENYr//EABcBAAMBAAAAAAAAAAAAAAAAAAABAgP/2gAIAQMQAAAAhGn/xAAnEAAABAEMAwAAAAAAAAAAAAACAwQGBwAFEBMUFzdVhKS00xIhIv/aAAgBAQABPwCUJsPm/quSZRdND7IN0p7JO12uBjOBe1msvsUzoqqzp6os7wriwnD+zgjF7EOV7UQc/wBqm66ItYgz/pOMXR//xAAfEQABAwMFAAAAAAAAAAAAAAACAAEhAwQQExQzUnL/2gAIAQIBAT8AACtC1Kks8Qt9S6kr7iH1j//EABsRAAIBBQAAAAAAAAAAAAAAAAABAhASITEy/9oACAEDAQE/AOsItZDdP//Z",
  pdf: "JVBERi0yLjAKJbq63toKNSAwIG9iajw8L0xpbmVhcml6ZWQgMS9MIDE3NjUvTyA4L0UgMTI5OC9OIDEvVCAxNDc4L0ggWyA1OTIgMzAwXT4+CmVuZG9iagogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo2IDAgb2JqPDwvUm9vdCA3IDAgUi9JbmZvIDMgMCBSL0lEWzwzQjcwMjhCODI4NTc2QTZCREY0RURCODQ3MkU5NUVGNj48NUM0REI5RjgzODhBNDE0MTE2NzQzNEFGQTBDRUM1QUM+XS9TaXplIDEzL1ByZXYgMTQ3OS9MZW5ndGggMzkvVHlwZS9YUmVmL0ZpbHRlci9GbGF0ZURlY29kZS9EZWNvZGVQYXJtczw8L0NvbHVtbnMgMy9QcmVkaWN0b3IgMTI+Pi9JbmRleFs1IDhdL1dbMSAyIDBdPj5zdHJlYW0KeJxjYmTgZ2JgOMHEwOTLxMAYAcRtTIx/2Jn+s7QxMfw7CABAawZkCmVuZHN0cmVhbQplbmRvYmoKc3RhcnR4cmVmCjAKJSVFT0YKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo3IDAgb2JqPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjEyIDAgb2JqPDwvUyAzNi9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQxPj5zdHJlYW0KeJxjYGBgZmBgCmAAAsZpDHAAZTMBMQtCFKQWjBkYmhlYrBgYAEujAlEKZW5kc3RyZWFtCmVuZG9iagogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjggMCBvYmo8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjAgMTAgMCBSPj4+Pi9Dcm9wQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyAxMSAwIFI+PgplbmRvYmoKOSAwIG9iajw8L1R5cGUvT2JqU3RtL04gMS9GaXJzdCA1L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNTI+PnN0cmVhbQp4nDM0UDBQsLHRD6ksSNV3y88r0Q8uTSoBcUAihvpOicWpYGGP1Jyy1JLM5EQ7OwCykhF/CmVuZHN0cmVhbQplbmRvYmoKMTEgMCBvYmo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDY1Pj5zdHJlYW0KeJwr5DJQAMGidCgjyJ3LKYTLyFTB3MxMz8zUwMDIxEQhJIVL381AwdBIISSNS6MktbhEMySLyzWEK5ALALXjDgQKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqPDwvVHlwZS9PYmpTdG0vTiAyL0ZpcnN0IDkvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA5Mj4+c3RyZWFtCnicM1IwUDBWMDZVsLHRD6ksSNUPSExPLdb3zkwpjrYAygXF6jvnl+aVKBja2QGVOBelJpZk5ue5JJakarhYGRkYmRgYGpgZmhiYmBhHaer75qfgkLKzAwBC6hzKCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iajw8L1Jvb3QgNyAwIFIvSW5mbyAzIDAgUi9JRFs8M0I3MDI4QjgyODU3NkE2QkRGNEVEQjg0NzJFOTVFRjY+PDVDNERCOUY4Mzg4QTQxNDExNjc0MzRBRkEwQ0VDNUFDPl0vU2l6ZSA1L0xlbmd0aCAzMC9UeXBlL1hSZWYvRmlsdGVyL0ZsYXRlRGVjb2RlL0RlY29kZVBhcm1zPDwvQ29sdW1ucyA1L1ByZWRpY3RvciAxMj4+L0luZGV4WzAgNV0vV1sxIDIgMl0+PnN0cmVhbQp4nGNiAAEmRlYhEPn7PZAECTAy/Wc9xvAfACj6BNgKZW5kc3RyZWFtCmVuZG9iagpzdGFydHhyZWYKMjE1CiUlRU9GCg==",
};

type SupportedExtension = keyof typeof BASE64_CONTENT_FILES;

/**
 * Generate file with base64 content. Supported file extensions: txt, png, jpg, pdf
 */
export const generateFile = async (
  filePath: string,
  options: {
    baseDir?: string;
  },
): Promise<string> => {
  const fileExtension = path.extname(filePath).replace(".", "");
  if (fileExtension.length === 0) {
    throw new Error(`Invalid file path "${filePath}".`);
  }

  if (Object.keys(BASE64_CONTENT_FILES).indexOf(fileExtension) === -1) {
    throw new Error(`File extension "${fileExtension}" is not supported.`);
  }

  const base64Content =
    BASE64_CONTENT_FILES[fileExtension as SupportedExtension];
  const fileContent = Buffer.from(base64Content, "base64");
  const actualFilePath = options.baseDir
    ? path.join(options.baseDir, filePath)
    : filePath;

  try {
    await fs.mkdir(path.dirname(actualFilePath), { recursive: true });
    await fs.writeFile(actualFilePath, fileContent);

    return actualFilePath;
  } catch (error) {
    throw new Error(
      `The file "${actualFilePath}" cannot be created.\nError: ${error}`,
    );
  }
};

export const generateCsvFile = async (
  csvContent: string,
  options: {
    baseDir?: string;
    destFilePath?: string;
    encoding?: SupportedEncoding;
  },
): Promise<string> => {
  let filePath = options.destFilePath;
  if (filePath) {
    filePath = options.baseDir
      ? path.join(options.baseDir, filePath)
      : filePath;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  } else {
    const prefix = "cli-kintone-csv-file-";
    const tempDir = await fs.mkdtemp(
      options.baseDir ? path.join(options.baseDir, prefix) : prefix,
    );
    filePath = path.join(tempDir, "records.csv");
  }

  await _writeFile(csvContent, filePath, { encoding: options.encoding });

  return filePath;
};

export const generateFileWithContent = async (
  content: string,
  filePath: string,
  options: { baseDir?: string; encoding?: SupportedEncoding },
): Promise<string> => {
  const actualFilePath = options.baseDir
    ? path.join(options.baseDir, filePath)
    : filePath;
  await fs.mkdir(path.dirname(actualFilePath), { recursive: true });
  await _writeFile(content, actualFilePath, { encoding: options.encoding });

  return actualFilePath;
};

const _writeFile = async (
  content: string,
  filePath: string,
  options?: { encoding?: SupportedEncoding },
): Promise<void> => {
  if (options && options.encoding) {
    return fs.writeFile(filePath, iconv.encode(content, options.encoding));
  }

  return fs.writeFile(filePath, content);
};
