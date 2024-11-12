import { Frequency } from '@workspace/models'
import { DayInterval } from 'minimal-time-helpers'

import { BacktestingSession } from './session.js'
import { BacktestingStatus } from './status.js'
import { BacktestingStrategy } from './strategy.js'

/**
 * @example
 *
 * ```ts
 *  // File implementing Worker backtesting.js
 *
 *  self.onmessage = (event: MessageEvent<BacktestingMessageInData>) => {
 *    // Do something with `event.data`.
 *  })
 * ```
 */
export type BacktestingMessageInData =
	| { type: 'PAUSE' }
	| { type: 'RESUME' }
	| { type: 'STOP' }
	| {
		type: 'SET_AFTER_STEP_BEHAVIOUR'
	} & Pick<BacktestingSession, 'afterStepBehaviour'>
	| {
		type: 'SET_DAY_INTERVAL'
		dayInterval: DayInterval
	}
	| {
		type: 'SET_FREQUENCY'
		frequency: Frequency
	}
	| {
		type: 'START'
		dayInterval: DayInterval
		frequency: Frequency
	} & Pick<BacktestingStrategy, 'flow' | 'strategyKey' | 'strategyName'>

/**
 * @example
 *
 * ```ts
 *  const backtesting = new Worker("/path/to/worker/backtesting.js")
 *
 *  backtesting.onmessage = (event: MessageEvent<BacktestingMessageOutData>) => {
 *    // Do something with `event.data`.
 *  })
 * ```
 */
export type BacktestingMessageOutData =
	| {
		type: 'STATUS_CHANGED'
		status: BacktestingStatus
	}
	| {
		type: 'UPDATED_MEMORY'
	} & Pick<BacktestingSession, 'memory'>
	| {
		type: 'UPDATED_ORDERS'
	} & Pick<BacktestingSession, 'orders'>
	| {
		type: 'UPDATED_PROGRESS'
	} & Pick<BacktestingSession, 'currentTimestamp' | 'stepIndex' | 'numSteps'>
