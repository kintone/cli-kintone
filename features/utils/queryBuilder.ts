import type {
  SubCommand,
  ImportArgs,
  ExportArgs,
  DeleteArgs,
} from "./subCommand";
import { ImportCommand, ExportCommand, DeleteCommand } from "./subCommand";
import * as ArgumentsList from "./arguments";
import type { Argument } from "./arguments";

export const SUPPORTED_COMMANDS = <const>["record"];

export type Command = (typeof SUPPORTED_COMMANDS)[number];

export class QueryBuilder {
  private readonly command?: string;
  private subCommand?: SubCommand;

  constructor(options: { command?: Command; subCommand?: SubCommand } = {}) {
    this.command = options.command;
    this.subCommand = options.subCommand;
  }

  static record() {
    return new QueryBuilder({ command: "record" });
  }

  import(args: ImportArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    if (args.filePath.length === 0) {
      throw new Error(`The "filePath" argument is required.`);
    }

    const argsList: Argument[] = [
      new ArgumentsList.BaseUrl(args.baseUrl),
      new ArgumentsList.App(args.app),
      new ArgumentsList.FilePath(args.filePath),
      new ArgumentsList.Username(args.username),
      new ArgumentsList.Password(args.password),
      new ArgumentsList.ApiToken(args.apiToken),
      new ArgumentsList.GuestSpaceId(args.guestSpaceId),
      new ArgumentsList.AttachmentsDir(args.attachmentsDir),
      new ArgumentsList.Encoding(args.encoding),
      new ArgumentsList.UpdateKey(args.updateKey),
      new ArgumentsList.Fields(args.fields),
    ];
    this.subCommand = new ImportCommand(argsList);
    return this;
  }

  export(args: ExportArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    const argsList: Argument[] = [
      new ArgumentsList.BaseUrl(args.baseUrl),
      new ArgumentsList.App(args.app),
      new ArgumentsList.Username(args.username),
      new ArgumentsList.Password(args.password),
      new ArgumentsList.ApiToken(args.apiToken),
      new ArgumentsList.GuestSpaceId(args.guestSpaceId),
      new ArgumentsList.AttachmentsDir(args.attachmentsDir),
      new ArgumentsList.Encoding(args.encoding),
      new ArgumentsList.Fields(args.fields),
      new ArgumentsList.Condition(args.condition),
      new ArgumentsList.OrderBy(args.orderBy),
    ];

    this.subCommand = new ExportCommand(argsList, args.destFilePath);
    return this;
  }

  delete(args: DeleteArgs) {
    if (args.baseUrl.length === 0) {
      throw new Error(`The "baseUrl" argument is required.`);
    }

    if (args.app.length === 0) {
      throw new Error(`The "app" argument is required.`);
    }

    const argsList: Argument[] = [
      new ArgumentsList.BaseUrl(args.baseUrl),
      new ArgumentsList.App(args.app),
      new ArgumentsList.ApiToken(args.apiToken),
      new ArgumentsList.GuestSpaceId(args.guestSpaceId),
      new ArgumentsList.Encoding(args.encoding),
      new ArgumentsList.FilePath(args.filePath),
      new ArgumentsList.Yes(args.yes),
    ];

    this.subCommand = new DeleteCommand(argsList);
    return this;
  }

  getQuery() {
    if (!this.command) {
      throw new Error("The command is not initialized.");
    }

    if (!this.subCommand) {
      throw new Error("The sub command is not initialized.");
    }

    return `${
      this.command
    } ${this.subCommand.getSubCommandName()}${this.subCommand.getQuery()}`;
  }
}
