import type { SpawnSyncReturns, ChildProcessByStdio } from "child_process";
import type { Credentials, AppCredential, Permission } from "./credentials";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import type { SupportedEncoding, Replacements } from "./helper";
import {
  generateCsvFile,
  execCliKintoneSync,
  execCliKintone,
  generateFile,
  getRecordNumbers,
  replacePlaceholders,
} from "./helper";
import {
  getAppCredentialByAppKey,
  getAPITokenByAppAndPermissions,
  getUserCredentialByUserKey,
  getUserCredentialByAppAndUserPermissions,
} from "./credentials";
import type { Writable, Readable } from "node:stream";

type Response = {
  stdout: Buffer;
  stderr: Buffer;
  status: number | null;
};

export class OurWorld extends World {
  public env: { [key: string]: string } = {};
  public replacements: Replacements = {};
  private _childProcess?: ChildProcessByStdio<Writable, Readable, Readable>;
  private _workingDir?: string;
  private _credentials?: Credentials;
  private _response?: SpawnSyncReturns<Buffer> | Response;

  public get childProcess() {
    if (this._childProcess === undefined) {
      throw new Error("No child process found. Please run the command first.");
    }
    return this._childProcess;
  }

  public set childProcess(value) {
    this._childProcess = value;
  }

  public get response() {
    if (this._response === undefined) {
      throw new Error("No response found. Please run cli-kintone first.");
    }
    return this._response;
  }

  public set response(value) {
    this._response = value;
  }

  public get credentials() {
    if (this._credentials === undefined) {
      throw new Error("No credentials found. Please init credentials first.");
    }
    return this._credentials;
  }

  public get workingDir() {
    if (this._workingDir === undefined) {
      throw new Error("No working dir found. Please init working dir first.");
    }
    return this._workingDir;
  }

  public set workingDir(value: string) {
    this._workingDir = value;
  }

  public init(options: { workingDir?: string; credentials?: Credentials }) {
    if (options.workingDir && options.workingDir.length > 0) {
      this.workingDir = options.workingDir;
    }

    if (options.credentials) {
      this._credentials = options.credentials;
    }
  }

  public execCliKintoneSync(args: string) {
    this.response = execCliKintoneSync(
      replacePlaceholders(args, this.replacements),
      {
        env: this.env,
        cwd: this.workingDir,
      },
    );
  }

  public execCliKintone(args: string) {
    this.childProcess = execCliKintone(
      replacePlaceholders(args, this.replacements),
      {
        env: this.env,
        cwd: this.workingDir,
      },
    );

    let stdout: Buffer;
    let stderr: Buffer;

    this.childProcess.stdout.on("data", (data: Buffer) => {
      stdout = data;
    });

    this.childProcess.stderr.on("data", (data: Buffer) => {
      stderr = data;
    });

    this.childProcess.on("close", (code: number) => {
      this.response = {
        stdout: stdout ?? Buffer.from(""),
        stderr: stderr ?? Buffer.from(""),
        status: code,
      };
    });

    this.childProcess.on("error", (err) => {
      throw new Error(`Error: ${err.message}`);
    });
  }

  public async generateCsvFile(
    inputCsvObject: string[][],
    options?: { filePath?: string; encoding?: SupportedEncoding },
  ) {
    const csvContent = inputCsvObject
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return generateCsvFile(csvContent, {
      baseDir: this.workingDir,
      destFilePath: options?.filePath,
      encoding: options?.encoding,
    });
  }

  public async generateFile(content: string, filePath: string) {
    return generateFile(content, filePath, { baseDir: this.workingDir });
  }

  public getAppCredentialByAppKey(appKey: string): AppCredential {
    const appCredential = getAppCredentialByAppKey(
      this.credentials.apps,
      appKey,
    );
    if (appCredential === undefined) {
      throw new Error(`The credential with app key ${appKey} is not found`);
    }

    if (appCredential.appId.length === 0) {
      throw new Error(`The credential with app key ${appKey} has no App ID`);
    }

    return appCredential;
  }

  public getAPITokenByAppAndPermissions(
    appKey: string,
    permissions: Permission[],
  ): string {
    const apiToken = getAPITokenByAppAndPermissions(
      this.credentials.apps,
      appKey,
      permissions,
    );

    if (!apiToken) {
      throw new Error(
        `The token with exact permissions (${permissions.join(
          ", ",
        )}) is not found.`,
      );
    }

    return apiToken.token;
  }

  public getUserCredentialByUserKey(userKey: string) {
    const userCredential = getUserCredentialByUserKey(
      this.credentials.users,
      userKey,
    );
    if (userCredential === undefined) {
      throw new Error(
        `The user credential with user key ${userKey} is not found`,
      );
    }

    return userCredential;
  }

  public getUserCredentialByAppAndUserPermissions(
    appKey: string,
    permissions: Permission[],
  ) {
    const userCredential = getUserCredentialByAppAndUserPermissions(
      this.credentials,
      appKey,
      permissions,
    );
    if (userCredential === undefined) {
      throw new Error(
        `The user credential with app key ${appKey} and exact permissions (${permissions.join(
          ", ",
        )}) is not found`,
      );
    }

    return userCredential;
  }

  public getRecordNumbersByAppKey(
    appKey: string,
    fieldCode?: string,
  ): string[] {
    const credential = this.getAppCredentialByAppKey(appKey);
    const apiToken = this.getAPITokenByAppAndPermissions(appKey, ["view"]);
    return getRecordNumbers(credential.appId, apiToken, {
      fieldCode,
      guestSpaceId: credential.guestSpaceId,
    });
  }

  public replacePlaceholdersInRawDataTables(table: string[][]): string[][] {
    if (Object.keys(this.replacements).length === 0) {
      return table;
    }

    return table.map((row) =>
      row.map((cell) => replacePlaceholders(cell, this.replacements)),
    );
  }

  public replacePlaceholdersInHashesDataTables(
    table: Array<{ [key: string]: string }>,
  ): Array<{ [key: string]: string }> {
    if (Object.keys(this.replacements).length === 0) {
      return table;
    }

    return table.map((row) => {
      const newRow: { [key: string]: string } = {};
      Object.keys(row).forEach((key) => {
        newRow[key] = replacePlaceholders(row[key], this.replacements);
      });
      return newRow;
    });
  }
}

// Helpers to avoid having to specify generics every time
export const Given = cucumber.Given<OurWorld>;
export const When = cucumber.When<OurWorld>;
export const Then = cucumber.Then<OurWorld>;
export const Before = cucumber.Before<OurWorld>;
export const After = cucumber.After<OurWorld>;
