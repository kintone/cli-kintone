import yauzl from "yauzl";
import { promisify } from "util";
import * as streamBuffers from "stream-buffers";
import { finished } from "node:stream/promises";
import type { DriverInterface, Encoding, FileStats } from "./interface";

type Entries = Map<string, yauzl.Entry>;

export class ZipFileDriver implements DriverInterface {
  private readonly _buffer: Buffer;

  constructor(buffer: Buffer) {
    this._buffer = buffer;
  }

  public async fileList(): Promise<string[]> {
    const entries = await this.entries();
    return Array.from(entries.keys());
  }

  public async stat(fileName: string): Promise<FileStats> {
    const entry = await this.entry(fileName);
    return { size: entry.uncompressedSize, isFile: true };
  }

  private _entriesCache?: Entries;
  // TODO: Delete this function after https://github.com/kintone/js-sdk/pull/3037 merged
  public async cacheEntries(): Promise<void> {
    this._entriesCache = await this.entries();
  }
  public statSync(fileName: string): FileStats {
    if (this._entriesCache === undefined) {
      throw new Error("Run cacheEntries() before call statSync");
    }
    const entry = this._entriesCache.get(fileName);

    if (entry === undefined) {
      throw new Error(`Failed to find entry from the zip file: ${entry}`);
    }
    return { size: entry.uncompressedSize, isFile: true };
  }

  public async readFile(
    fileName: string,
    encoding?: null | undefined,
  ): Promise<Buffer>;
  public async readFile(fileName: string, encoding: Encoding): Promise<string>;
  public async readFile(
    fileName: string,
    encoding?: Encoding | null | undefined,
  ): Promise<Buffer | string> {
    const entry = await this.entry(fileName);

    const zipFile = await this.unzip();
    const stream = await promisify(zipFile.openReadStream).bind(zipFile)(entry);

    const output = new streamBuffers.WritableStreamBuffer();
    stream?.pipe(output);
    await finished(output);

    const contents = output.getContents();
    if (contents === false) {
      throw new Error("Failed to load contents to buffer");
    }
    switch (encoding) {
      case "utf-8":
        return contents.toString("utf-8");
      case null:
      case undefined:
      default:
        return contents;
    }
  }

  public async writeFile(
    _fileName: string,
    _data: string | Buffer,
  ): Promise<void> {
    // TODO: Implement
  }

  public get buffer() {
    return this._buffer;
  }

  private async unzip(): Promise<yauzl.ZipFile> {
    return promisify(yauzl.fromBuffer)(this._buffer);
  }

  private async entry(fileName: string): Promise<yauzl.Entry> {
    const entries = await this.entries();
    const entry = entries.get(fileName);
    if (entry === undefined) {
      throw new Error(`Failed to find entry from the zip file: ${entry}`);
    }
    return entry;
  }

  private async entries(): Promise<Entries> {
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
}
