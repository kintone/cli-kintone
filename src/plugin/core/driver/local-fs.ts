import type { DriverInterface, Encoding, FileStats } from "./interface";

import fs from "fs/promises";
import { statSync, createReadStream } from "fs";
import path from "path";
import type { Readable } from "node:stream";

/**
 * LocalFSDriver is a Driver for the local disc
 */
export class LocalFSDriver implements DriverInterface {
  private currentDir: string;

  constructor(dir?: string) {
    this.currentDir = dir ?? process.cwd();
  }

  public async fileList(): Promise<string[]> {
    const files = await fs.readdir(this.currentDir, { withFileTypes: true });
    return files.filter((file) => file.isFile()).map((f) => f.name);
  }

  public async stat(fileName: string): Promise<FileStats> {
    const filePath = path.resolve(this.currentDir, fileName);
    const stats = await fs.stat(filePath);
    stats.isFile();
    return {
      isFile: stats.isFile(),
      size: stats.size,
    };
  }

  public statSync(fileName: string): FileStats {
    const filePath = path.resolve(this.currentDir, fileName);
    const stats = statSync(filePath);
    stats.isFile();
    return {
      isFile: stats.isFile(),
      size: stats.size,
    };
  }

  public async readFile(fileName: string): Promise<Buffer>;
  public async readFile(fileName: string, encoding: Encoding): Promise<string>;
  public async readFile(
    fileName: string,
    encoding?: Encoding | null | undefined,
  ): Promise<Buffer | string> {
    const filePath = path.resolve(this.currentDir, fileName);
    return fs.readFile(filePath, {
      encoding: encoding,
    });
  }

  public async openReadStream(fileName: string): Promise<Readable> {
    const filePath = path.resolve(this.currentDir, fileName);
    return createReadStream(filePath);
  }

  public async writeFile(
    fileName: string,
    data: string | Buffer,
  ): Promise<void> {
    const filePath = path.resolve(this.currentDir, fileName);
    return fs.writeFile(filePath, data);
  }
}
