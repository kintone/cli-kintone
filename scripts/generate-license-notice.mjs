import { $, cd, which } from "zx";

import path from "path";
import { fileURLToPath } from "url";

// https://github.com/cybozu/license-manager
const licenseManager = await which(`license-manager`);

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

cd(projectRoot);

await $`${licenseManager} analyze`;
await $`${licenseManager} extract`;