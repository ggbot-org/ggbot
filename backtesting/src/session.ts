import {
	BalanceChangeEvent,
	Frequency,
	Order,
	StrategyMemory,
	StrategyParameters
} from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingStatus, BacktestingStatusController } from "./status.js"
import { BacktestingStrategy } from "./strategy.js"

export class BacktestingSession implements BacktestingStatusController {
	balanceHistory: BalanceChangeEvent[]
	dayInterval: DayInterval | undefined
	frequency: Frequency | undefined
	memory: StrategyMemory
	orders: Order[]
	params: StrategyParameters
	status: BacktestingStatus
	strategy: BacktestingStrategy | undefined

	constructor() {
		this.balanceHistory = []
		this.memory = {}
		this.orders = []
		this.params = {}
		this.status = "initial"
	}

	get canRun(): boolean {
		if (!this.dayInterval) return false
		if (!this.frequency) return false
		if (!this.strategy) return false
		return true
	}

	pause() {
		if (this.status === "running") {
			this.status = "paused"
			return true
		}
		return false
	}

	resume() {
		if (!this.canRun) return false
		if (this.status === "paused") {
			this.status = "running"
			return true
		}
		return false
	}

	start() {
		if (!this.canRun) return false
		// Can start only if status is "initial" or "done".
		// In case status is "done" and input parameters are unchanged
		// it will run again and (hopefully :) produce same results.
		if (this.status !== "initial" && this.status !== "done") return false
		this.status = "running"
		// Reset before run.
		this.balanceHistory = []
		this.memory = {}
		this.orders = []
		return true
	}

	stop() {
		if (this.status === "running") {
			this.status = "initial"
			return true
		}
		return false
	}
}
