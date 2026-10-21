import { KintoneRestAPIError } from "@kintone/rest-api-client";
import {
  PluginFileNotFoundError,
  PluginUploadRequestError,
} from "../../upload/error";

describe("PluginFileNotFoundError", () => {
  it("should return error message", () => {
    const error = new PluginFileNotFoundError("/path/to/plugin.zip");

    expect(error.toString()).toBe(
      "Failed to upload the plugin.\nPlugin file not found: /path/to/plugin.zip\n",
    );
  });
});

describe("PluginUploadRequestError", () => {
  it("should return error message", () => {
    const cause = new KintoneRestAPIError({
      data: {
        id: "dummy-error-id",
        code: "CB_VA01",
        message: "Invalid request.",
      },
      status: 400,
      statusText: "Bad Request",
      headers: {},
    });
    const error = new PluginUploadRequestError(cause);

    expect(error.toString()).toBe(
      "Failed to upload the plugin.\n[400] [CB_VA01] Invalid request. (dummy-error-id)\n",
    );
  });
});
