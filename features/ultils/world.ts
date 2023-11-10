import type { SpawnSyncReturns } from "child_process";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import { createCsvFile, execCliKintoneSync } from "./helper";

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  public workingDir?: string;
  private _response?: SpawnSyncReturns<string>;

  public get response() {
    if (this._response === undefined) {
      throw new Error("No response found. Please run cli-kintone first.");
    }
    return this._response;
  }

  public set response(value) {
    this._response = value;
  }

  public init(options: { workingDir: string }) {
    this.workingDir = options.workingDir;
  }

  public execCliKintoneSync(args: string) {
    this.response = execCliKintoneSync(args, {
      env: this.env,
      cwd: this.workingDir,
    });
  }

  public async createCsvFile(inputCsvObject: string[][], filePath?: string) {
    return createCsvFile(inputCsvObject, {
      baseDir: this.workingDir,
      destFilePath: filePath,
    });
  }
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
export const Before = cucumber.Before<OurWorld>;
export const After = cucumber.After<OurWorld>;
