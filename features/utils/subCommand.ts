export interface SubCommand {
  getSubCommand: () => string;
  getQuery: () => void;
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

  getSubCommand() {
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
    if (this.args.username) {
      queryString += ` --username ${this.args.username}`;
    }

    if (this.args.password) {
      queryString += ` --password ${this.args.password}`;
    }

    if (this.args.apiToken) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.attachmentsDir) {
      queryString += ` --attachments-dir ${this.args.attachmentsDir}`;
    }

    if (this.args.encoding) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.updateKey) {
      queryString += ` --update-key ${this.args.updateKey}`;
    }

    if (this.args.fields) {
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

  getSubCommand() {
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
    if (this.args.username) {
      queryString += ` --username ${this.args.username}`;
    }

    if (this.args.password) {
      queryString += ` --password ${this.args.password}`;
    }

    if (this.args.apiToken) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.attachmentsDir) {
      queryString += ` --attachments-dir ${this.args.attachmentsDir}`;
    }

    if (this.args.encoding) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.fields) {
      queryString += ` --fields ${this.args.fields.join(",")}`;
    }

    if (this.args.condition) {
      queryString += ` --condition ${this.args.condition}`;
    }

    if (this.args.orderBy) {
      queryString += ` --order-by ${this.args.orderBy}`;
    }

    if (this.args.destFilePath) {
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

  getSubCommand() {
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

    if (this.args.apiToken) {
      queryString += ` --api-token ${
        Array.isArray(this.args.apiToken)
          ? this.args.apiToken.join(",")
          : this.args.apiToken
      }`;
    }

    if (this.args.guestSpaceId) {
      queryString += ` --guest-space-id ${this.args.guestSpaceId}`;
    }

    if (this.args.encoding) {
      queryString += ` --encoding ${this.args.encoding}`;
    }

    if (this.args.filePath) {
      queryString += ` --file-path ${this.args.filePath}`;
    }

    if (this.args.yes) {
      queryString += ` --yes`;
    }

    return queryString;
  }
}
