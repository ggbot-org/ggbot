import { isDev } from "@ggbot2/env"

export const logging = (workspace: string) => ({
	info: (...args: unknown[]) => {
		if (isDev) console.info(workspace, ...args)
	}
})
