import yauzl from "yauzl";
import { promisify } from "util";
import * as streamBuffers from "stream-buffers";
import { finished } from "node:stream/promises";

export type Entries = Map<string, yauzl.Entry>;

export class ZipFile {
  private readonly _buffer: Buffer;

  constructor(buffer: Buffer) {
    this._buffer = buffer;
  }

  public async entries(): Promise<Entries> {
    const zipFile = await this.unzip();

    return new Promise((res, rej) => {
      const entries: Entries = new Map();

      zipFile?.on("entry", (entry) => {
        entries.set(entry.fileName, entry);
      });
      zipFile?.on("end", () => {
        res(entries);
      });
      zipFile?.on("error", rej);
    });
  }

  public async fileList(): Promise<string[]> {
    const entries = await this.entries();
    return Array.from(entries.keys());
  }

  public async getFileAsString(fileName: string): Promise<string> {
    const entries = await this.entries();
    const entry = entries.get(fileName);
    if (entry === undefined) {
      throw new Error(`Failed to find entry from the zip file: ${entry}`);
    }
    return zipEntryToString(await this.unzip(), entry);
  }

  public get buffer() {
    return this._buffer;
  }

  public async unzip(): Promise<yauzl.ZipFile> {
    return promisify(yauzl.fromBuffer)(this._buffer);
  }
}

const zipEntryToString = async (
  zipFile: yauzl.ZipFile,
  zipEntry: yauzl.Entry,
): Promise<string> => {
  const stream = await promisify(zipFile.openReadStream).bind(zipFile)(
    zipEntry,
  );

  const output = new streamBuffers.WritableStreamBuffer();
  stream?.pipe(output);
  await finished(output);
  return output.getContents().toString("utf8");
};
