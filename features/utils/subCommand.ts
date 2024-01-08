import * as ArgumentsList from "./arguments";

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
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (this.args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    if (this.args.filePath.length === 0) {
      throw new Error(`The "filePath" argument is required.`);
    }

    const argsList: ArgumentsList.Argument[] = [
      new ArgumentsList.BaseUrl(this.args.baseUrl),
      new ArgumentsList.App(this.args.app),
      new ArgumentsList.FilePath(this.args.filePath),
      new ArgumentsList.Username(this.args.username),
      new ArgumentsList.Password(this.args.password),
      new ArgumentsList.ApiToken(this.args.apiToken),
      new ArgumentsList.GuestSpaceId(this.args.guestSpaceId),
      new ArgumentsList.AttachmentsDir(this.args.attachmentsDir),
      new ArgumentsList.Encoding(this.args.encoding),
      new ArgumentsList.UpdateKey(this.args.updateKey),
      new ArgumentsList.Fields(this.args.fields),
    ];

    let queryString = "";
    argsList.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

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
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (this.args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    const argsList: ArgumentsList.Argument[] = [
      new ArgumentsList.BaseUrl(this.args.baseUrl),
      new ArgumentsList.App(this.args.app),
      new ArgumentsList.Username(this.args.username),
      new ArgumentsList.Password(this.args.password),
      new ArgumentsList.ApiToken(this.args.apiToken),
      new ArgumentsList.GuestSpaceId(this.args.guestSpaceId),
      new ArgumentsList.AttachmentsDir(this.args.attachmentsDir),
      new ArgumentsList.Encoding(this.args.encoding),
      new ArgumentsList.Fields(this.args.fields),
      new ArgumentsList.Condition(this.args.condition),
      new ArgumentsList.OrderBy(this.args.orderBy),
    ];

    let queryString = "";
    argsList.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

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
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (this.args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    const argsList: ArgumentsList.Argument[] = [
      new ArgumentsList.BaseUrl(this.args.baseUrl),
      new ArgumentsList.App(this.args.app),
      new ArgumentsList.ApiToken(this.args.apiToken),
      new ArgumentsList.GuestSpaceId(this.args.guestSpaceId),
      new ArgumentsList.Encoding(this.args.encoding),
      new ArgumentsList.FilePath(this.args.filePath),
      new ArgumentsList.Yes(this.args.yes),
    ];

    let queryString = "";
    argsList.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

    return queryString;
  }
}
