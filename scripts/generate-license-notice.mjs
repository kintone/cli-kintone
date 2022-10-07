import { $, cd, which } from "zx";

import path from "path";
import { fileURLToPath } from "url";

// https://github.com/github/licensed
const licensed = await which(`licensed`);

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(dirname, "../");

cd(projectRoot);

await $`${licensed} cache`;
await $`${licensed} status`;
await $`${licensed} notice`;
