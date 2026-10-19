import type { PrivateKey } from "../../core";

export type PrivateKeyRepository = {
  readonly save: (privateKey: PrivateKey) => Promise<string>;
};
