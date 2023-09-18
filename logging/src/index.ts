// eslint-disable no-console
import { ENV } from "@workspace/env"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const isDev = DEPLOY_STAGE !== "main"

/**
 * Output log with a prefix string and a timestamp.
 *
 * Create a src/logging.ts file to share logging prefix in a package.
 *
 * @example
 *
 * ```ts
 * import { logging } from "@workspace/logging"
 *
 * const { info, warn } = logging("my-prefix")
 *
 * export { info, warn }
 * ```
 */

export const logging = (prefix: string) => ({
	/** Prints log to stdout, only on deploy stages `local` and `next`. */
	info: (...args: unknown[]) => {
		if (isDev) console.info(new Date().toJSON(), prefix, ...args)
	},
	/** Prints log to stderr, on any deploy stage. */
	warn: (...args: unknown[]) => {
		console.warn(new Date().toJSON(), prefix, ...args)
	}
})
