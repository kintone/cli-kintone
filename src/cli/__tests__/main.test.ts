import { vi } from "vitest";
import { checkRejectArg } from "./cliHelper";

vi.setConfig({ testTimeout: 30000 });

describe("main", () => {
  it("should throw error when no commands are passed", () => {
    return checkRejectArg({
      arg: "",
      errorMessage: "Not enough non-option arguments: got 0, need at least 1",
    });
  });
  it("should throw error when an undefined command is passed", () => {
    return checkRejectArg({
      arg: "dummy",
      errorMessage: "Unknown argument: dummy",
    });
  });
  it("should throw error when an undefined argument is passed", () => {
    return checkRejectArg({
      arg: "record import --base-url https://example.com --app 1 --file-path /your/file/path --dummy",
      errorMessage: "Unknown argument: dummy",
    });
  });
  it("should throw error when required arguments are missing", () => {
    return checkRejectArg({
      arg: "record import",
      errorMessage: /Missing required arguments:/,
    });
  });
});
