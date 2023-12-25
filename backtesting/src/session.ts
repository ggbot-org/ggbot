import {
	BalanceChangeEvent,
	Frequency,
	frequencyIntervalDuration,
	Order,
	StrategyMemory
} from "@workspace/models"
import {
	dateToTime,
	DayInterval,
	dayIntervalToDate,
	Time
} from "minimal-time-helpers"

import { BacktestingStatus, BacktestingStatusController } from "./status.js"
import { BacktestingStrategy } from "./strategy.js"

export class BacktestingSession implements BacktestingStatusController {
	balanceHistory: BalanceChangeEvent[]
	memory: StrategyMemory
	orders: Order[]
	status: BacktestingStatus
	stepIndex: number
	times: Time[]

	private _dayInterval: DayInterval | undefined
	private _frequency: Frequency | undefined
	private _strategy: BacktestingStrategy | undefined

	constructor() {
		this._dayInterval = undefined
		this._frequency = undefined
		this._strategy = undefined
		this.balanceHistory = []
		this.memory = {}
		this.orders = []
		this.status = "initial"
		this.stepIndex = 0
		this.times = []
	}

	get canRun(): boolean {
		if (this.times.length === 0) return false
		if (!this._strategy) return false
		return true
	}

	get currentTimestamp(): Time | undefined {
		return this.times[this.stepIndex]
	}

	get completionPercentage(): number {
		if (this.times.length === 0) return 0
		return Math.floor((100 * this.stepIndex) / this.times.length)
	}

	get dayInterval(): DayInterval | undefined {
		return this._dayInterval
	}

	get frequency(): Frequency | undefined {
		return this._frequency
	}

	get nextTime(): Time | undefined {
		if (this.status !== "running") return
		const time = this.times[this.stepIndex]
		this.stepIndex++
		if (this.times.length === this.stepIndex) this.status = "done"
		return time
	}

	get numSteps() {
		return this.times.length
	}

	get strategy(): BacktestingStrategy | undefined {
		return this._strategy
	}

	set dayInterval(value: DayInterval) {
		if (this.status !== "initial") return
		this._dayInterval = value
	}

	set frequency(value: Frequency) {
		if (this.status !== "initial") return
		this._frequency = value
	}

	set strategy(value: BacktestingStrategy) {
		if (this.status !== "initial") return
		this._strategy = value
	}

	set strategyFlow(value: BacktestingStrategy["flow"]) {
		if (this.status !== "initial") return
		if (this._strategy === undefined) return
		this._strategy.flow = value
	}

	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.pause()
	 * ```
	 */
	pause(): boolean {
		// Can pause only if status is "running".
		if (this.status !== "running") return false
		this.status = "paused"
		return true
	}

	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.resume()
	 * ```
	 */
	resume(): boolean {
		if (!this.canRun) return false
		// Can resume only if status is "paused".
		if (this.status !== "paused") return false
		this.status = "running"
		return true
	}

	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.start()
	 * ```
	 */
	start(): boolean {
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
		this.stepIndex = 0
		return true
	}

	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.stop()
	 * ```
	 */
	stop(): boolean {
		if (["paused", "running"].includes(this.status)) {
			this.status = "initial"
			return true
		}
		return false
	}

	computeTimes() {
		const { dayInterval, frequency } = this
		if (!dayInterval || !frequency) return
		this.times = []
		const { start, end } = dayIntervalToDate(dayInterval)
		const interval = frequencyIntervalDuration(frequency)
		let date = start
		let time
		while (date < end) {
			time = dateToTime(date)
			this.times.push(time)
			date = new Date(time + interval)
		}
	}
}
