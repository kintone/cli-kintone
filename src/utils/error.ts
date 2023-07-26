import {
  KintoneAllRecordsError,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";

type NetworkError = { code?: string; message?: string };

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
    } else if (this.cause instanceof KintoneAllRecordsError) {
      return this._toStringKintoneAllRecordsError(this.cause);
    } else if (this.cause instanceof KintoneRestAPIError) {
      return this._toStringKintoneRestAPIError(this.cause);
    } else if (this._isNetworkError(this.cause)) {
      return this._toStringNetworkError(this.cause);
    }

    return this.cause + "\n";
  }

  private _toStringKintoneAllRecordsError(
    error: KintoneAllRecordsError
  ): string {
    let errorMessage = "An error occurred while processing records.\n";
    errorMessage += this._toStringKintoneRestAPIError(error.error);
    return errorMessage;
  }

  protected _toStringKintoneRestAPIError(error: KintoneRestAPIError): string {
    switch (error.code) {
      // HACK: Currently, there is no official way to detect if the App is in Guest Spaces, so we use an error code.
      // That error code could be changed without announcement.
      case "GAIA_IL23":
        return "Please specify --guest-space-id option to access an App in Guest Spaces.\n";
      default:
        return `${error.message}\n`;
    }
  }

  private _isNetworkError(error: unknown): error is NetworkError {
    // TODO: once @kintone/rest-api-client officially exports the socket timeout error, we can use it instead.
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ECONNABORTED"
    );
  }

  private _toStringNetworkError(error: NetworkError): string {
    let errorMessage = `[${error.code}] ${error.message}\n`;
    errorMessage += "The cli-kintone aborted due to a network error.\n";
    errorMessage += "Please check your network connection.\n";
    return errorMessage;
  }

  toString(): string {
    let errorMessage = "";
    if (this.message.length > 0) {
      errorMessage = this.message + "\n";
    }

    if (this.detail.length > 0) {
      errorMessage += this.detail + "\n";
    }
    errorMessage += this._toStringCause();
    return errorMessage;
  }
}
