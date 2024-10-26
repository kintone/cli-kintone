import path from "path";
import fs from "fs";

import { PrivateKey } from "../../crypto";

const privateKeyPath = path.join(__dirname, "fixtures", "private.ppk");

describe("PrivateKey", () => {
  it("can export private key", () => {
    const privateKey = PrivateKey.generateKey();
    const privateKeyString = privateKey.exportPrivateKey();
    expect(typeof privateKeyString).toBe("string");
    expect(/^-----BEGIN RSA PRIVATE KEY-----/.test(privateKeyString)).toBe(
      true,
    );
  });

  it("can generate uuid with correct length", () => {
    const privateKey = PrivateKey.generateKey();
    const id = privateKey.uuid();

    expect(typeof id).toBe("string");
    expect(id.length).toBe(32);
  });

  it("can generate expected uuid from the private key", () => {
    const privateKeyString = fs.readFileSync(privateKeyPath, "utf8");
    const privateKey = PrivateKey.importKey(privateKeyString);
    const id = privateKey.uuid();

    expect(id).toBe("ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj");
  });

  it("the exported privateKey is the same as original privateKey", () => {
    const original = fs.readFileSync(privateKeyPath, "utf8");
    const privateKey = PrivateKey.importKey(original);
    const exported = privateKey.exportPrivateKey();
    expect(exported).toBe(original);
  });
});
