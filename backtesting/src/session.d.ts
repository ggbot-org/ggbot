import { Frequency, Order, StrategyFlowGraph, StrategyKind, StrategyMemory } from '@workspace/models'
import { DayInterval, Time } from 'minimal-time-helpers'

import { BacktestingStatus, BacktestingStatusController } from './status.js'
import { BacktestingStrategy } from './strategy.js'
export declare class BacktestingSession implements BacktestingStatusController {
	static defaultAfterStepBehaviour: {
		pauseOnMemoryChange: boolean;
		pauseOnNewOrder: boolean;
	}
	afterStepBehaviour: {
		pauseOnMemoryChange: boolean;
		pauseOnNewOrder: boolean;
	}
	memory: StrategyMemory
	orders: Order[]
	status: BacktestingStatus
	stepIndex: number
	times: Time[]
	get canRun(): boolean
	get currentTimestamp(): Time | undefined
	get completionPercentage(): number
	get dayInterval(): DayInterval | undefined
	get frequency(): Frequency | undefined
	get nextTime(): Time | undefined
	get numSteps(): number
	get strategy(): BacktestingStrategy | undefined
	get strategyFlow(): StrategyFlowGraph | undefined
	get strategyKind(): StrategyKind | undefined
	set dayInterval(value: DayInterval)
	set frequency(value: Frequency)
	set strategy(value: BacktestingStrategy)
	set strategyFlow(value: BacktestingStrategy['flow'])
	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.pause()
	 * ```
	 */
	pause(): boolean
	reset(): void
	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.resume()
	 * ```
	 */
	resume(): boolean
	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.start()
	 * ```
	 */
	start(): boolean
	/**
	 * @example
	 *
	 * ```ts
	 * const statusChanged = session.stop()
	 * ```
	 */
	stop(): boolean
	computeTimes(): void
}
