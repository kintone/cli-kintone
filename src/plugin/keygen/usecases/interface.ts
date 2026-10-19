export type PrivateKeyRepository = {
  readonly exists: (filePath: string) => Promise<boolean>;
  readonly save: (filePath: string, privateKey: string) => Promise<void>;
};
