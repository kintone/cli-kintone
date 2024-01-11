import type { Subcommand } from "../index";
import * as Arguments from "../arguments";

export const SUBCOMMANDS = {
  IMPORT: "import",
  EXPORT: "export",
  DELETE: "delete",
} as const;
export type SubcommandType = (typeof SUBCOMMANDS)[keyof typeof SUBCOMMANDS];

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
  guestSpaceId?: string;
  filePath?: string;
  encoding?: string;
  yes?: boolean;
};

export type ImportArgsList =
  | Arguments.BaseUrl
  | Arguments.App
  | Arguments.FilePath
  | Arguments.Username
  | Arguments.Password
  | Arguments.ApiToken
  | Arguments.GuestSpaceId
  | Arguments.AttachmentsDir
  | Arguments.Encoding
  | Arguments.UpdateKey
  | Arguments.Fields;

export type ExportArgsList =
  | Arguments.BaseUrl
  | Arguments.App
  | Arguments.Username
  | Arguments.Password
  | Arguments.ApiToken
  | Arguments.GuestSpaceId
  | Arguments.AttachmentsDir
  | Arguments.Encoding
  | Arguments.Fields
  | Arguments.Condition
  | Arguments.OrderBy;

export type DeleteArgsList =
  | Arguments.BaseUrl
  | Arguments.App
  | Arguments.ApiToken
  | Arguments.GuestSpaceId
  | Arguments.FilePath
  | Arguments.Encoding
  | Arguments.Yes;

export const getArgumentsListBySubcommand = (
  args: ImportArgs | ExportArgs | DeleteArgs,
  subcommandType: SubcommandType,
): ImportArgsList[] | ExportArgsList[] | DeleteArgsList[] => {
  switch (subcommandType) {
    case SUBCOMMANDS.IMPORT: {
      const importArgs = args as ImportArgs;
      return [
        new Arguments.BaseUrl(importArgs.baseUrl),
        new Arguments.App(importArgs.app),
        new Arguments.FilePath(importArgs.filePath),
        new Arguments.Username(importArgs.username),
        new Arguments.Password(importArgs.password),
        new Arguments.ApiToken(importArgs.apiToken),
        new Arguments.GuestSpaceId(importArgs.guestSpaceId),
        new Arguments.AttachmentsDir(importArgs.attachmentsDir),
        new Arguments.Encoding(importArgs.encoding),
        new Arguments.UpdateKey(importArgs.updateKey),
        new Arguments.Fields(importArgs.fields),
      ] as ImportArgsList[];
    }
    case SUBCOMMANDS.EXPORT: {
      const exportArgs = args as ExportArgs;
      return [
        new Arguments.BaseUrl(exportArgs.baseUrl),
        new Arguments.App(exportArgs.app),
        new Arguments.Username(exportArgs.username),
        new Arguments.Password(exportArgs.password),
        new Arguments.ApiToken(exportArgs.apiToken),
        new Arguments.GuestSpaceId(exportArgs.guestSpaceId),
        new Arguments.AttachmentsDir(exportArgs.attachmentsDir),
        new Arguments.Encoding(exportArgs.encoding),
        new Arguments.Fields(exportArgs.fields),
        new Arguments.Condition(exportArgs.condition),
        new Arguments.OrderBy(exportArgs.orderBy),
      ] as ExportArgsList[];
    }
    case SUBCOMMANDS.DELETE: {
      const deleteArgs = args as DeleteArgs;
      return [
        new Arguments.BaseUrl(deleteArgs.baseUrl),
        new Arguments.App(deleteArgs.app),
        new Arguments.ApiToken(deleteArgs.apiToken),
        new Arguments.GuestSpaceId(deleteArgs.guestSpaceId),
        new Arguments.FilePath(deleteArgs.filePath),
        new Arguments.Encoding(deleteArgs.encoding),
        new Arguments.Yes(deleteArgs.yes),
      ] as DeleteArgsList[];
    }
    default:
      return [];
  }
};

export class ImportCommand implements Subcommand {
  private args: ImportArgsList[];

  constructor(args: ImportArgsList[]) {
    this.args = args;
  }

  getSubcommandName() {
    return SUBCOMMANDS.IMPORT;
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

export class ExportCommand implements Subcommand {
  private readonly args: ExportArgsList[];
  private readonly destFilePath?: string;

  constructor(args: ExportArgsList[], destFilePath?: string) {
    this.args = args;
    this.destFilePath = destFilePath;
  }

  getSubcommandName() {
    return SUBCOMMANDS.EXPORT;
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

export class DeleteCommand implements Subcommand {
  private args: DeleteArgsList[];

  constructor(args: DeleteArgsList[]) {
    this.args = args;
  }

  getSubcommandName() {
    return SUBCOMMANDS.DELETE;
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
