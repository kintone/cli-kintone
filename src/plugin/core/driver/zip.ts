import yauzl from "yauzl";
import { promisify } from "util";
import type { DriverInterface, Encoding, FileStats } from "./interface";
import type { Readable } from "node:stream";
import consumers from "node:stream/consumers";

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
  //   This is a workaround to implement synchronous stat operation
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

  public async readFile(fileName: string): Promise<Buffer>;
  public async readFile(fileName: string, encoding: Encoding): Promise<string>;
  public async readFile(
    fileName: string,
    encoding?: Encoding,
  ): Promise<Buffer | string> {
    const entry = await this.entry(fileName);

    const zipFile = await this.unzip();
    const stream = await promisify(zipFile.openReadStream).bind(zipFile)(entry);
    const contents = await consumers.buffer(stream);

    switch (encoding) {
      case "utf-8":
        return contents.toString("utf-8");
      case null:
      case undefined:
      default:
        return contents;
    }
  }

  public async openReadStream(fileName: string): Promise<Readable> {
    const entry = await this.entry(fileName);
    const zipFile = await this.unzip();
    return promisify(zipFile.openReadStream).bind(zipFile)(entry);
  }

  public async writeFile(
    _fileName: string,
    _data: string | Buffer,
  ): Promise<void> {
    // TODO: Implement
    throw new Error("This function is not implemented yet");
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
