// eslint-disable no-console
import { ENV } from "@workspace/env"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const isDev = DEPLOY_STAGE !== "main"

export const logging = (prefix: string) => ({
	info: (...args: unknown[]) => {
		if (isDev) console.info(new Date().toJSON(), prefix, ...args)
	},
	warn: (...args: unknown[]) => {
		if (isDev) console.warn(new Date().toJSON(), prefix, ...args)
	}
})
