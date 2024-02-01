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
	/** Prints log to STDOUT, only on deploy stages `local` and `next`. */
	info: (...args: unknown[]) => {
		if (isDev) console.info(new Date().toJSON(), prefix, ...args)
	},
	/** Prints log to STDERR, on any deploy stage. */
	warn: (...args: unknown[]) => {
		console.warn(
			new Date().toJSON(),
			prefix,
			...args.map((item) => {
				if (item instanceof Error) return item.message
				return item
			})
		)
	},
	/** Prints error and its stacktrace to STDERR, on any deploy stage. */
	debug: (error: unknown) => {
		console.debug(new Date().toJSON(), error)
	}
})
