import type { Readable } from "node:stream";

export type Encoding = "utf-8";

export type FileStats = {
  isFile: boolean;
  size: number;
};

/**
 * Driver represents filesystem like a local disc, zip file, memory, etc.
 */
export interface DriverInterface {
  /**
   * Returns files in the filesystem
   */
  fileList(): Promise<string[]>;

  /**
   * Returns file information
   * @param fileName
   */
  stat(fileName: string): Promise<FileStats>;
  // TODO: Delete this function after https://github.com/kintone/js-sdk/pull/3037 merged
  statSync(fileName: string): FileStats;

  /**
   * Read the entire contents of a file.
   * @param fileName
   */
  readFile(fileName: string): Promise<Buffer>;
  readFile(fileName: string, encoding: "utf-8"): Promise<string>;

  /**
   * Create readable stream to read a file contents.
   * @param fileName
   */
  openReadStream(fileName: string): Promise<Readable>;

  /**
   * Write the entire contents to a file.
   * @param fileName
   * @param data
   */
  writeFile(fileName: string, data: string | Buffer): Promise<void>;
}
