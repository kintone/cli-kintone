import { CliKintoneError } from "../../utils/error";

export class RunError extends CliKintoneError {
  constructor(error: unknown) {
    super("", error);
  }
}
