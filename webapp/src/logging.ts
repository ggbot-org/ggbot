/* eslint-disable no-console */

export const logging = (prefix: string) => ({
	info: (...args: unknown[]) => {
		if (IS_DEV) console.info(prefix, ...args)
	},
	warn: (...args: unknown[]) => {
		if (IS_DEV) console.warn(prefix, ...args)
	}
})
