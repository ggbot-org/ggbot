import { resolve } from "node:path"

/**
 * Resolve package directory.
 *
 * Create a _src/package.ts_ file, then do
 *
 * ```ts
 * import { packagePublicDir, packageRootDir } from "@ggbot2/repo"
 *
 * const rootDir = packageRootDir(import.meta.url)
 *
 * export const publicDir = packageDir(rootDir, "public")
 * export const srcDir = packageDir(rootDir, "src")
 * ```
 */
export const packageDir = (rootDir: string, dirname: string) =>
	resolve(rootDir, dirname)
