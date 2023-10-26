import { Item, newId } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingStatus, BacktestingStatusController } from "./status.js"
import { BacktestingStrategy } from "./strategy.js"

export class BacktestingSession implements BacktestingStatusController {
	readonly dayInterval: DayInterval
	readonly id: Item["id"]
	status: BacktestingStatus
	strategy: BacktestingStrategy

	constructor({
		dayInterval,
		strategy
	}: Pick<BacktestingSession, "dayInterval" | "strategy">) {
		this.dayInterval = dayInterval
		this.status = "ready"
		this.strategy = strategy
		this.id = newId()
	}

	pause() {
		if (this.status === "running") this.status = "paused"
	}

	resume() {
		if (this.status === "paused") this.status = "running"
	}

	start() {
		if (this.status === "ready") this.status = "running"
	}

	stop() {
		if (this.status === "running") this.status = "ready"
	}
}
