/* eslint-disable no-console */

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
 * const { warn, debug } = logging("my-prefix")
 *
 * export { warn, debug }
 * ```
 *
 * To enable info logging, on Node runtime you can do something like this:
 *
 * @example
 *
 * ```ts
 * import { logging } from "@workspace/logging"
 * import { ENV } from "@workspace/env"
 *
 * const { info } = logging("my-prefix", ENV.isDev)
 *
 * export { info }
 * ```
 */

export const logging = (prefix: string, isDev = false) => ({
	/** Prints log to STDOUT, only on is `isDev`. */
	info: (...args: unknown[]) => {
		if (!isDev) return
		console.info(new Date().toJSON(), prefix, ...args)
	},
	/** Prints log to STDERR. */
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
	/** Prints error and its stacktrace to STDERR. */
	debug: (error: unknown) => {
		console.debug(new Date().toJSON(), error)
	}
})
