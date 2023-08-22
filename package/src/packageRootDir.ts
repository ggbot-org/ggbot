import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Resolve package directory.
 *
 * Create a _src/package.ts_ file, then do
 *
 * ```ts
 * const rootDir = packageRootDir(import.meta.url)
 * ```
 */
export const packageRootDir = (caller: string) =>
	resolve(dirname(dirname(fileURLToPath(caller))))
