import { CliKintoneError } from "../../utils/error.js";

export class RunError extends CliKintoneError {
  constructor(error: unknown) {
    super("", error);
  }
}
