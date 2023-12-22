/* eslint-disable no-console */

let enabled = false

export type LoggingController = {
	enable(): void
	disable(): void
}

const log: LoggingController = {
	enable: () => {
		enabled = true
	},
	disable: () => {
		enabled = false
	}
}

export const logging = (prefix: string) => ({
	/** Prints log with "Info" level, only on deploy stages `local` and `next`. */
	info: (...args: unknown[]) => {
		if (enabled) console.info(prefix, ...args)
	},
	/** Prints log with "Warn" level, on any deploy stage. */
	warn: (...args: unknown[]) => {
		console.warn(prefix, ...args)
	}
})

if (IS_DEV) log.enable()

globalThis.log = log
