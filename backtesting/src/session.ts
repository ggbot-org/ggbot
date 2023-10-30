import {
	Frequency,
	StrategyMemory,
	StrategyParameters,
	StrategyScheduling
} from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingStatus, BacktestingStatusController } from "./status.js"
import { BacktestingStrategy } from "./strategy.js"

export class BacktestingSession
	implements
		BacktestingStatusController,
		Pick<BacktestingStrategy, "strategyId">,
		Required<Pick<StrategyScheduling, "frequency" | "params">>
{
	readonly dayInterval: DayInterval
	status: BacktestingStatus
	strategy: BacktestingStrategy

	readonly frequency: Frequency
	params: StrategyParameters
	memory: StrategyMemory

	constructor({
		dayInterval,
		frequency,
		params,
		strategy
	}: Pick<
		BacktestingSession,
		"dayInterval" | "frequency" | "params" | "strategy"
	>) {
		this.dayInterval = dayInterval
		this.status = "ready"
		this.strategy = strategy
		this.frequency = frequency
		this.params = params
		this.memory = {}
	}

	get strategyId() {
		return this.strategy.strategyId
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
