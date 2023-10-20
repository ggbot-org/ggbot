import { DflowExecutor } from "@workspace/dflow"
import { DayInterval } from "minimal-time-helpers"

export class Backtesting {
	dayInterval: DayInterval
	readonly executor: DflowExecutor

	constructor({
		dayInterval,
		executor
	}: Pick<Backtesting, "dayInterval" | "executor">) {
		this.dayInterval = dayInterval
		this.executor = executor
	}
}
