import { PrivateKeyFileExistsError } from "../../keygen/error";

describe("PrivateKeyFileExistsError", () => {
  it("should return error message", () => {
    const error = new PrivateKeyFileExistsError("/path/to/private.ppk");

    expect(error.toString()).toBe(
      "Failed to generate a private key.\nFile /path/to/private.ppk already exists.\n",
    );
  });
});
