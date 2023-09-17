// eslint-disable no-console
export const logging = (prefix: string, enabled: unknown) => ({
	info: (...args: unknown[]) => {
		if (enabled) console.info(new Date().toJSON(), prefix, ...args)
	},
	warn: (...args: unknown[]) => {
		if (enabled) console.warn(new Date().toJSON(), prefix, ...args)
	}
})
