import type { SpawnSyncReturns, ChildProcessByStdio } from "child_process";
import type { Credentials, AppCredential, Permission } from "./credentials";
import * as cucumber from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import type { SupportedEncoding, Replacements } from "./helper";
import {
  execCliKintoneSync,
  execCliKintone,
  getRecordNumbers,
  replacePlaceholders,
} from "./helper";
import {
  generateFile,
  generateCsvFile,
  generateFileWithContent,
} from "./fileGenerator";
import {
  getAppCredentialByAppKey,
  getAPITokenByAppAndPermissions,
  getUserCredentialByUserKey,
  getUserCredentialByAppAndUserPermissions,
} from "./credentials";
import type { Writable, Readable } from "node:stream";
import { stat } from "fs/promises";
import path from "path";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

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
  private _response?: Response;

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
    const res: SpawnSyncReturns<Buffer> = execCliKintoneSync(
      replacePlaceholders(args, this.replacements),
      {
        env: this.env,
        cwd: this.workingDir,
      },
    );

    this.response = {
      stdout: res.stdout ?? Buffer.from(""),
      stderr: res.stderr ?? Buffer.from(""),
      status: res.status,
    };
  }

  public execCliKintone(args: string) {
    this.childProcess = execCliKintone(
      replacePlaceholders(args, this.replacements),
      {
        env: this.env,
        cwd: this.workingDir,
      },
    );

    let stdout: Buffer = Buffer.from("");
    let stderr: Buffer = Buffer.from("");

    this.childProcess.stdout.on("data", (data: Buffer) => {
      stdout = Buffer.concat([stdout, data]);
    });

    this.childProcess.stderr.on("data", (data: Buffer) => {
      stderr = Buffer.concat([stderr, data]);
    });

    this.childProcess.on("exit", (code: number) => {
      this.response = {
        stdout: stdout,
        stderr: stderr,
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

  public async generateFileWithContent(content: string, filePath: string) {
    return generateFileWithContent(content, filePath, {
      baseDir: this.workingDir,
    });
  }

  public async generateFile(filePath: string) {
    return generateFile(filePath, { baseDir: this.workingDir });
  }

  public async isFileExists(filePath: string): Promise<boolean> {
    return (await stat(path.join(this.workingDir, filePath))).isFile();
  }

  public async isDirectoryExists(dirPath: string): Promise<boolean> {
    return (await stat(path.join(this.workingDir, dirPath))).isDirectory();
  }

  public async generateDirectory(dirPath: string) {
    const fs = await import("fs");
    return fs.promises.mkdir(path.join(this.workingDir, dirPath), {
      recursive: true,
    });
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

  public async getPluginByPluginId(pluginId: string) {
    const credential = this.getUserCredentialByUserKey("kintone_admin");
    const client = new KintoneRestAPIClient({
      baseUrl: process.env.TEST_KINTONE_BASE_URL,
      auth: { username: credential.username, password: credential.password },
    });
    const resp = await client.plugin.getPlugins({ ids: [pluginId] } as any);
    return resp.plugins.find((plugin) => plugin.id === pluginId);
  }

  public async uninstallPluginByPluginId(pluginId: string) {
    const credential = this.getUserCredentialByUserKey("kintone_admin");
    const client = new KintoneRestAPIClient({
      baseUrl: process.env.TEST_KINTONE_BASE_URL,
      auth: { username: credential.username, password: credential.password },
    });
    const plugin = await this.getPluginByPluginId(pluginId);
    if (plugin) {
      await client.plugin.uninstallPlugin({ id: pluginId });
    }
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
