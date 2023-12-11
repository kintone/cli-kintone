import type {
  SubCommand,
  ImportArgs,
  ExportArgs,
  DeleteArgs,
} from "./subCommand";
import { ImportCommand, ExportCommand, DeleteCommand } from "./subCommand";

export class QueryBuilder {
  private readonly command: string;
  private subCommand?: SubCommand;

  constructor(options: { command?: string } = {}) {
    this.command = options.command || "";
  }

  static record() {
    return new QueryBuilder({ command: "record" });
  }

  static app() {
    return new QueryBuilder({ command: "app" });
  }

  import(args: ImportArgs) {
    this.subCommand = new ImportCommand(args);
    return this;
  }

  export(args: ExportArgs) {
    this.subCommand = new ExportCommand(args);
    return this;
  }

  delete(args: DeleteArgs) {
    this.subCommand = new DeleteCommand(args);
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
    } ${this.subCommand.getSubCommandName()} ${this.subCommand.getQuery()}`;
  }
}
