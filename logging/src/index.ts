export const logging = (prefix: string, enabled: unknown) => ({
	info: (...args: unknown[]) => {
		if (enabled) console.info(prefix, ...args)
	}
})
