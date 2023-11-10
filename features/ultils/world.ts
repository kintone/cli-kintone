import type { SpawnSyncReturns } from "child_process";
import type { Credential } from "./types";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import { createCsvFile, execCliKintoneSync } from "./helper";

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  public workingDir?: string;
  public credentials?: Credential[];
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

  public init(options: { workingDir: string; credentials?: Credential[] }) {
    this.workingDir = options.workingDir;

    if (options.credentials) {
      this.credentials = options.credentials;
    }
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

  public getCredentialByAppKey(appKey: string): Credential {
    const credential = this.credentials?.find((c) => c.key === appKey);
    if (credential === undefined) {
      throw new Error(`The credential with app key ${appKey} is not found`);
    }

    if (!credential.appId) {
      throw new Error(`The credential with app key ${appKey} has no App ID`);
    }

    return credential;
  }
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
export const Before = cucumber.Before<OurWorld>;
export const After = cucumber.After<OurWorld>;
