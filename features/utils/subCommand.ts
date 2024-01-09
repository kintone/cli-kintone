import type { Argument } from "./arguments";

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
  private args: Argument[];

  constructor(args: Argument[]) {
    this.args = args;
  }

  getSubCommandName() {
    return "import";
  }

  getQuery() {
    let queryString = "";
    this.args.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

    return queryString;
  }
}

export class ExportCommand implements SubCommand {
  private readonly args: Argument[];
  private readonly destFilePath?: string;

  constructor(args: Argument[], destFilePath?: string) {
    this.args = args;
    this.destFilePath = destFilePath;
  }

  getSubCommandName() {
    return "export";
  }

  getQuery() {
    let queryString = "";
    this.args.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

    if (this.destFilePath && this.destFilePath.length > 0) {
      queryString += ` > ${this.destFilePath}`;
    }

    return queryString;
  }
}

export class DeleteCommand implements SubCommand {
  private args: Argument[];

  constructor(args: Argument[]) {
    this.args = args;
  }

  getSubCommandName() {
    return "delete";
  }

  getQuery() {
    let queryString = "";
    this.args.forEach((arg) => {
      const query = arg.getArgumentQuery();
      if (query.length > 0) {
        queryString += ` ${query}`;
      }
    });

    return queryString;
  }
}
