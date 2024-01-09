import type {
  SubCommand,
  ImportArgs,
  ExportArgs,
  DeleteArgs,
} from "./subCommand";
import {
  ExportCommand,
  ImportCommand,
  DeleteCommand,
  IMPORT,
  EXPORT,
  DELETE,
} from "./subCommand";
import type { Argument } from "./arguments";
import { getArgumentsListBySubCommand } from "./arguments";
import {
  APP_IS_REQUIRED,
  BASE_URL_IS_REQUIRED,
  COMMAND_IS_NOT_INITIALIZED,
  FILE_PATH_IS_REQUIRED,
  SUB_COMMAND_IS_NOT_INITIALIZED,
} from "./error";

export const RECORD = "record";
export const SUPPORTED_COMMANDS = <const>[RECORD];

export type Command = (typeof SUPPORTED_COMMANDS)[number];

export class QueryBuilder {
  private readonly command?: string;
  private subCommand?: SubCommand;

  constructor(options: { command?: Command; subCommand?: SubCommand } = {}) {
    this.command = options.command;
    this.subCommand = options.subCommand;
  }

  static record() {
    return new QueryBuilder({ command: RECORD });
  }

  import(args: ImportArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(BASE_URL_IS_REQUIRED);
    }

    if (args.app.length === 0) {
      throw new Error(APP_IS_REQUIRED);
    }

    if (args.filePath.length === 0) {
      throw new Error(FILE_PATH_IS_REQUIRED);
    }

    const argsList: Argument[] = getArgumentsListBySubCommand(args, IMPORT);
    this.subCommand = new ImportCommand(argsList);

    return this;
  }

  export(args: ExportArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(BASE_URL_IS_REQUIRED);
    }

    if (args.app.length === 0) {
      throw new Error(APP_IS_REQUIRED);
    }

    const argsList: Argument[] = getArgumentsListBySubCommand(args, EXPORT);
    this.subCommand = new ExportCommand(argsList);

    return this;
  }

  delete(args: DeleteArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(BASE_URL_IS_REQUIRED);
    }

    if (args.app.length === 0) {
      throw new Error(APP_IS_REQUIRED);
    }

    const argsList: Argument[] = getArgumentsListBySubCommand(args, DELETE);
    this.subCommand = new DeleteCommand(argsList);

    return this;
  }

  getQuery() {
    if (!this.command) {
      throw new Error(COMMAND_IS_NOT_INITIALIZED);
    }

    if (!this.subCommand) {
      throw new Error(SUB_COMMAND_IS_NOT_INITIALIZED);
    }

    return `${
      this.command
    } ${this.subCommand.getSubCommandName()}${this.subCommand.getQuery()}`;
  }
}
