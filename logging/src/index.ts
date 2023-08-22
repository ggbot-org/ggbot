import { isDev } from "@ggbot2/env"

export const logging = (prefix: string) => ({
	info: (...args: unknown[]) => {
		if (isDev) console.info(prefix, ...args)
	}
})
