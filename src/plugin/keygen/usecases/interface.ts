import type { PrivateKey } from "../../core";

export type LocalPrivateKeyRepository = {
  readonly save: (privateKey: PrivateKey) => Promise<string>;
};
