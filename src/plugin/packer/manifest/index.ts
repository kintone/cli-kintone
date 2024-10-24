import { sourceList } from "./sourcelist";

interface ManifestInterface {
  sourceList(): string[];
}

class ManifestV1 implements ManifestInterface {
  manifest: any;

  constructor(json: string) {
    /* noop */
  }

  sourceList(): string[] {
    return sourceList(sourceList(this.manifest));
  }
}
