import crypto from "crypto";

export const sign = (contents: Buffer, privateKey: string): Buffer => {
  return crypto.sign("sha1", contents, {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });
};
