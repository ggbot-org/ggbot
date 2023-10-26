import { DflowExecutor } from "@workspace/dflow"

import { BacktestingSession } from "./session.js"
import { BacktestingStatusController } from "./status.js"

export class Backtesting implements BacktestingStatusController {
	readonly executor: DflowExecutor
	readonly sessions: Map<BacktestingSession["id"], BacktestingSession>

	constructor({ executor }: Pick<Backtesting, "executor">) {
		this.executor = executor
		this.sessions = new Map()
	}

	pause() {
		for (const session of this.sessions.values()) session.pause()
	}

	resume() {
		for (const session of this.sessions.values()) session.resume()
	}

	start() {
		for (const session of this.sessions.values()) session.start()
	}

	stop() {
		for (const session of this.sessions.values()) session.stop()
	}
}
