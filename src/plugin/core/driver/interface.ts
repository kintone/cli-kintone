import type { Readable } from "node:stream";

export type Encoding = "utf-8";

export type FileStats = {
  isFile: boolean;
  size: number;
};

export interface DriverInterface {
  fileList(): Promise<string[]>;
  stat(fileName: string): Promise<FileStats>;
  // TODO: Delete this function after https://github.com/kintone/js-sdk/pull/3037 merged
  statSync(fileName: string): FileStats;
  readFile(fileName: string): Promise<Buffer>;
  readFile(fileName: string, encoding: "utf-8"): Promise<string>;
  openReadStream(fileName: string): Promise<Readable>;
  writeFile(fileName: string, data: string | Buffer): Promise<void>;
}