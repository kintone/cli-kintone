export abstract class CliKintoneError extends Error {
  readonly message: string;
  readonly detail: string = "";
  readonly cause: unknown;
  protected constructor(message: string, cause: unknown) {
    super(message);

    this.name = "CliKintoneError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CliKintoneError.prototype);
  }

  protected _toStringCause(): string {
    if (this.cause instanceof CliKintoneError) {
      return this.cause.toString();
    }
    return this.cause + "\n";
  }

  toString(): string {
    let errorMessage = this.message + "\n";
    if (this.detail.length > 0) {
      errorMessage += this.detail + "\n";
    }
    errorMessage += this._toStringCause();
    return errorMessage;
  }
}
