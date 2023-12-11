export interface SubCommand {
  getSubCommandName: () => string;
  getQuery: () => string;
}

export type ImportArgs = {
  baseUrl: string;
  app: string;
  filePath: string;
  username?: string;
  password?: string;
  apiToken?: string | string[];
  guestSpaceId?: string;
  attachmentsDir?: string;
  encoding?: string;
  updateKey?: string;
  fields?: string[];
};

export type ExportArgs = {
  baseUrl: string;
  app: string;
  username?: string;
  password?: string;
  apiToken?: string | string[];
  guestSpaceId?: string;
  attachmentsDir?: string;
  encoding?: string;
  fields?: string[];
  condition?: string;
  orderBy?: string;
  destFilePath?: string;
};

export type DeleteArgs = {
  baseUrl: string;
  app: string;
  apiToken?: string | string[];
  filePath?: string;
  guestSpaceId?: string;
  encoding?: string;
  yes?: boolean;
};

export class ImportCommand implements SubCommand {
  private args: ImportArgs;

  constructor(args: ImportArgs) {
    this.args = args;
  }

  getSubCommandName() {
    return "import";
  }

  getQuery() {
    if (this.args.baseUrl.length === 0) {
      throw new Error("The base URL is required");
    }

    if (this.args.app.length === 0) {
      throw new Error("The app is required");
    }

    if (this.args.filePath.length === 0) {
      throw new Error("The file path is required");
    }

    let queryString = `--base-url ${this.args.baseUrl} --app ${this.args.app} --file-path ${this.args.filePath}`;
    if (this.args.username && this.args.username.length > 0) {
      queryString += ` --username ${this.args.username}`;
    }

    if (this.args.password && this.args.password.length > 0) {
      queryString += ` --password ${this.args.password}`;
    }

    if (this.args.apiToken && this.args.apiToken.length > 0) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId && this.args.guestSpaceId.length > 0) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.attachmentsDir && this.args.attachmentsDir.length > 0) {
      queryString += ` --attachments-dir ${this.args.attachmentsDir}`;
    }

    if (this.args.encoding && this.args.encoding.length > 0) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.updateKey && this.args.updateKey.length > 0) {
      queryString += ` --update-key ${this.args.updateKey}`;
    }

    if (this.args.fields && this.args.fields.length > 0) {
      queryString += ` --fields ${this.args.fields.join(",")}`;
    }

    return queryString;
  }
}

export class ExportCommand implements SubCommand {
  private args: ExportArgs;

  constructor(args: ExportArgs) {
    this.args = args;
  }

  getSubCommandName() {
    return "export";
  }

  getQuery() {
    if (this.args.baseUrl.length === 0) {
      throw new Error("The base URL is required");
    }

    if (this.args.app.length === 0) {
      throw new Error("The app is required");
    }

    let queryString = `--base-url ${this.args.baseUrl} --app ${this.args.app}`;
    if (this.args.username && this.args.username.length > 0) {
      queryString += ` --username ${this.args.username}`;
    }

    if (this.args.password && this.args.password.length > 0) {
      queryString += ` --password ${this.args.password}`;
    }

    if (this.args.apiToken && this.args.apiToken.length > 0) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId && this.args.guestSpaceId.length > 0) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.attachmentsDir && this.args.attachmentsDir.length > 0) {
      queryString += ` --attachments-dir ${this.args.attachmentsDir}`;
    }

    if (this.args.encoding && this.args.encoding.length > 0) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.fields && this.args.fields.length > 0) {
      queryString += ` --fields ${this.args.fields.join(",")}`;
    }

    if (this.args.condition && this.args.condition.length > 0) {
      queryString += ` --condition ${this.args.condition}`;
    }

    if (this.args.orderBy && this.args.orderBy.length > 0) {
      queryString += ` --order-by ${this.args.orderBy}`;
    }

    if (this.args.destFilePath && this.args.destFilePath.length > 0) {
      queryString += ` > ${this.args.destFilePath}`;
    }

    return queryString;
  }
}

export class DeleteCommand implements SubCommand {
  private args: DeleteArgs;

  constructor(args: DeleteArgs) {
    this.args = args;
  }

  getSubCommandName() {
    return "delete";
  }

  getQuery() {
    if (this.args.baseUrl.length === 0) {
      throw new Error("The base URL is required");
    }

    if (this.args.app.length === 0) {
      throw new Error("The app is required");
    }

    let queryString = `--base-url ${this.args.baseUrl} --app ${this.args.app}`;

    if (this.args.apiToken && this.args.apiToken.length > 0) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId && this.args.guestSpaceId.length > 0) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.encoding && this.args.encoding.length > 0) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.filePath && this.args.filePath.length > 0) {
      queryString += ` --file-path ${this.args.filePath}`;
    }

    if (this.args.yes) {
      queryString += ` --yes`;
    }

    return queryString;
  }
}
