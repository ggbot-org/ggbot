import { pid } from "node:process"

import { isDev } from "@workspace/env"
import { now, timeToTimestamp } from "minimal-time-helpers"

const timestamp = () => timeToTimestamp(now())

const prefix = () => ["executor", pid, timestamp()]

export const log = {
	error(arg: unknown) {
		if (arg instanceof Error) console.error(...prefix(), arg.message)
		else console.error(...prefix(), arg)
	},
	info(...args: unknown[]) {
		if (!isDev) return
		console.info(...prefix(), ...args)
	}
}
