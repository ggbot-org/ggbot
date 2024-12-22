import { frequencyIntervalDuration } from '@workspace/models'
import { dateToTime, dayIntervalToDate } from 'minimal-time-helpers'

import { BacktestingStrategy } from './strategy.js'

/**
 * @typedef {import('minimal-time-helpers').DayInterval} DayInterval
 * @typedef {import('minimal-time-helpers').Time} Time
 */

/**
 * @typedef {import('@workspace/models').Frequency} Frequency
 * @typedef {import('@workspace/models').StrategyMemory} StrategyMemory
 */

/**
 * @typedef {import('./status').BacktestingStatus} BacktestingStatus
 * @typedef {import('./status').BacktestingStatusController} BacktestingStatusController
 */

/** @implements {BacktestingStatusController} */
export class BacktestingSession {
	static defaultAfterStepBehaviour = { pauseOnMemoryChange: false, pauseOnNewOrder: false }

	afterStepBehaviour = BacktestingSession.defaultAfterStepBehaviour

	/** @type {import('./session').BacktestingSession['memory']} */
	memory = {}
	/** @type {import('./session').BacktestingSession['orders']} */
	orders = []
	/** @type {import('./session').BacktestingSession['status']} */
	status = 'initial'
	stepIndex = 0
	/** @type {import('./session').BacktestingSession['times']} */
	times = []

	/** @type {DayInterval | undefined} */
	#dayInterval = undefined
	/** @type {Frequency | undefined} */
	#frequency = undefined
	/** @type {BacktestingStrategy | undefined} */
	#strategy = undefined

	/** @type {import('./session').BacktestingSession['canRun']} */
	get canRun() {
		if (this.times.length === 0) return false
		if (!this.#strategy) return false
		return true
	}

	/** @type {import('./session').BacktestingSession['currentTimestamp']} */
	get currentTimestamp() {
		return this.times[this.stepIndex]
	}

	/** @type {import('./session').BacktestingSession['completionPercentage']} */
	get completionPercentage() {
		if (this.times.length === 0) return 0
		return Math.floor((100 * this.stepIndex) / this.times.length)
	}

	/** @type {import('./session').BacktestingSession['dayInterval']} */
	get dayInterval() {
		return this.#dayInterval
	}

	/** @type {import('./session').BacktestingSession['frequency']} */
	get frequency() {
		return this.#frequency
	}

	/** @type {import('./session').BacktestingSession['nextTime']} */
	get nextTime() {
		if (this.status !== 'running') return
		const time = this.times[this.stepIndex]
		this.stepIndex++
		if (this.times.length === this.stepIndex) this.status = 'done'
		return time
	}

	get numSteps() {
		return this.times.length
	}

	/** @type {import('./session').BacktestingSession['strategy']} */
	get strategy() {
		return this.#strategy
	}

	/** @type {import('./session').BacktestingSession['strategyFlow']} */
	get strategyFlow() {
		return this.#strategy?.flow
	}

	/** @type {import('./session').BacktestingSession['strategyKind']} */
	get strategyKind() {
		return this.#strategy?.strategyKey.strategyKind
	}

	/** @type {import('./session').BacktestingSession['dayInterval']} */
	set dayInterval(value) {
		if (['running', 'paused'].includes(this.status)) return
		this.#dayInterval = value
	}

	/** @type {import('./session').BacktestingSession['frequency']} */
	set frequency(value) {
		if (['running', 'paused'].includes(this.status)) return
		this.#frequency = value
	}

	/** @type {import('./session').BacktestingSession['strategy']} */
	set strategy(value) {
		if (['running', 'paused'].includes(this.status)) return
		this.#strategy = value
	}

	/** @param {BacktestingStrategy['flow']} value */
	set strategyFlow(value) {
		if (this.status !== 'initial') return
		if (this.#strategy === undefined) return
		this.#strategy.flow = value
	}

	/** @type {import('./session').BacktestingSession['pause']} */
	pause() {
		// Can pause only if status is "running".
		if (this.status !== 'running') return false
		this.status = 'paused'
		return true
	}

	reset() {
		this.memory = {}
		this.orders = []
		this.stepIndex = 0
	}

	/** @type {import('./session').BacktestingSession['resume']} */
	resume() {
		if (!this.canRun) return false
		// Can resume only if status is "paused".
		if (this.status !== 'paused') return false
		this.status = 'running'
		return true
	}

	/** @type {import('./session').BacktestingSession['start']} */
	start() {
		if (!this.canRun) return false
		// Can start only if status is "initial" or "done".
		// In case status is "done" and input parameters are unchanged
		// it will run again and (hopefully :) produce same results.
		if (this.status !== 'initial' && this.status !== 'done') return false
		this.status = 'running'
		this.reset()
		return true
	}

	/** @type {import('./session').BacktestingSession['stop']} */
	stop() {
		if (['paused', 'running'].includes(this.status)) {
			this.status = 'initial'
			this.reset()
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
