export abstract class CliKintoneError extends Error {
  protected readonly cause: unknown;
  constructor(message: string, cause: unknown) {
    super(message);

    this.name = "CliKintoneError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CliKintoneError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    if (this.cause instanceof CliKintoneError) {
      errorMessage += this.cause.toString();
    } else {
      errorMessage += this.cause + "\n";
    }
    return errorMessage;
  }
}
