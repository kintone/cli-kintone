import { RecordCommand } from "./record/command";

export interface Command {
  getCommandName: () => string;
  getQuery: () => string;
}

export interface Subcommand {
  getSubcommandName: () => string;
  getQuery: () => string;
}

export class QueryBuilder {
  static record(): RecordCommand {
    return new RecordCommand();
  }
}
