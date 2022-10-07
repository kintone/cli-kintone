#!/usr/bin/env zx
import path from "path";

// https://github.com/github/licensed
const licensed = await which(`licensed`);

const projectRoot = path.join(__dirname, "../");

cd(projectRoot)

await $`${licensed} cache`
await $`${licensed} status`
await $`${licensed} notice`
