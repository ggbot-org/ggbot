import { Frequency } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingSession } from "./session.js"
import { BacktestingStatus } from "./status.js"
import { BacktestingStrategy } from "./strategy.js"

/**
 * @example
 *
 * ```ts
 *  // File implementing Worker backtesting.js
 *
 *  self.onmessage = (event: MessageEvent<BacktestingMessageInData>) => {
 *    console.log(event.data)
 *  })
 * ```
 */
export type BacktestingMessageInData =
	| {
			type: "PAUSE"
	  }
	| {
			type: "RESUME"
	  }
	| {
			type: "STOP"
	  }
	| {
			type: "SET_DAY_INTERVAL"
			dayInterval: DayInterval
	  }
	| {
			type: "SET_FREQUENCY"
			frequency: Frequency
	  }
	| ({
			type: "START"
			dayInterval: DayInterval
			frequency: Frequency
	  } & Pick<BacktestingStrategy, "strategyKey" | "view">)

/**
 * @example
 *
 * ```ts
 *  const backtesting = new Worker("/path/to/worker/backtesting.js")
 *
 *  backtesting.onmessage = (event: MessageEvent<BacktestingMessageOutData>) => {
 *    console.log(event.data)
 *  })
 * ```
 */
export type BacktestingMessageOutData =
	| {
			type: "STATUS_CHANGED"
			status: BacktestingStatus
	  }
	| {
			type: "UPDATED_DAY_INTERVAL"
			dayInterval: DayInterval
	  }
	| {
			type: "UPDATED_FREQUENCY"
			frequency: Frequency
	  }
	| (Pick<
			BacktestingSession,
			"balanceHistory" | "memory" | "orders" | "status"
	  > & {
			type: "UPDATED_RESULT"
	  })
