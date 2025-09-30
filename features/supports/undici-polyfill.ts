// Polyfill for undici with Node.js 18
// This fixes the "File is not defined" error when using undici@7+ with Node.js 18

/* eslint-disable n/no-unsupported-features/node-builtins */
import { File, Blob } from "buffer";

if (typeof (globalThis as any).File === "undefined") {
  (globalThis as any).File = File;
}

if (typeof (globalThis as any).Blob === "undefined") {
  (globalThis as any).Blob = Blob;
}
/* eslint-enable n/no-unsupported-features/node-builtins */
