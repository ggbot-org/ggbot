import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { filename } from "./filenames.js";

/**
 * Resolve package directory.
 *
 * Create a _src/package.ts_ file, then do
 *
 * ```ts
 * const rootDir = packageRootDir(import.meta.url);
 * ```
 */
export const packageRootDir = (caller: string) => {
  const callerPathname = fileURLToPath(caller);
  const { packageJs } = filename;
  if (basename(callerPathname) !== packageJs)
    throw new Error(`Filename must be ${packageJs}`);
  return dirname(dirname(fileURLToPath(caller)));
};

export const packagePublicDir = (rootDir: string) => resolve(rootDir, "public");
