export class ValidatorError extends Error {
  private readonly cause: unknown;

  constructor(cause: unknown) {
    const message = "Failed to delete records";
    super(message);

    this.name = "ValidatorError";
    this.message = message;
    this.cause = cause;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidatorError.prototype);
  }

  toString(): string {
    let errorMessage = "";
    errorMessage += this.message + "\n";
    errorMessage += this.cause + "\n";

    return errorMessage;
  }
}
