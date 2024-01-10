import type {
  ImportArgs,
  ExportArgs,
  DeleteArgs,
  ImportArgsList,
  ExportArgsList,
  DeleteArgsList,
} from "./subcommand";
import {
  ExportCommand,
  ImportCommand,
  DeleteCommand,
  SUBCOMMANDS,
  getArgumentsListBySubcommand,
} from "./subcommand";
import {
  APP_IS_REQUIRED,
  BASE_URL_IS_REQUIRED,
  FILE_PATH_IS_REQUIRED,
  SUB_COMMAND_IS_NOT_INITIALIZED,
} from "../error";
import type { Command, Subcommand } from "../index";

export const RECORD = "record";
export const SUPPORTED_COMMANDS = <const>[RECORD];

export type CommandType = (typeof SUPPORTED_COMMANDS)[number];

export class RecordCommand implements Command {
  private subcommand?: Subcommand;

  constructor(subcommand?: Subcommand) {
    this.subcommand = subcommand;
  }

  getCommandName() {
    return RECORD;
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

    const argsList: ImportArgsList[] = getArgumentsListBySubcommand(
      args,
      SUBCOMMANDS.IMPORT,
    );
    this.subcommand = new ImportCommand(argsList);

    return this;
  }

  export(args: ExportArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(BASE_URL_IS_REQUIRED);
    }

    if (args.app.length === 0) {
      throw new Error(APP_IS_REQUIRED);
    }

    const argsList: ExportArgsList[] = getArgumentsListBySubcommand(
      args,
      SUBCOMMANDS.EXPORT,
    );
    this.subcommand = new ExportCommand(argsList, args.destFilePath);

    return this;
  }

  delete(args: DeleteArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(BASE_URL_IS_REQUIRED);
    }

    if (args.app.length === 0) {
      throw new Error(APP_IS_REQUIRED);
    }

    const argsList: DeleteArgsList[] = getArgumentsListBySubcommand(
      args,
      SUBCOMMANDS.DELETE,
    );
    this.subcommand = new DeleteCommand(argsList);

    return this;
  }

  getQuery() {
    if (!this.subcommand) {
      throw new Error(SUB_COMMAND_IS_NOT_INITIALIZED);
    }

    return `${this.getCommandName()} ${this.subcommand.getSubcommandName()}${this.subcommand.getQuery()}`;
  }
}
