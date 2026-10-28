import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "../../init/error";

describe("PluginDirectoryExistsError", () => {
  it("should return error message", () => {
    const error = new PluginDirectoryExistsError("my-plugin");

    expect(error.toString()).toBe(
      "Could not create a plug-in project.\nmy-plugin already exists. Choose a different directory\n",
    );
  });
});

describe("PluginProjectCreationError", () => {
  it("should return error message", () => {
    const error = new PluginProjectCreationError(
      new Error("Installing dependencies were failed"),
    );

    expect(error.toString()).toBe(
      "Could not create a plug-in project.\nError: Installing dependencies were failed\n",
    );
  });
});
