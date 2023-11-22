import { Frequency } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingSession } from "./session.js"
import { BacktestingStatus } from "./status.js"

type BacktestingSessionStartData = Pick<
	BacktestingSession,
	"dayInterval" | "frequency" | "strategy"
>

type BacktestingSessionUpdatedResultData = Pick<
	BacktestingSession,
	"balanceHistory" | "memory" | "orders"
>

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
	| (BacktestingSessionStartData & {
			type: "START"
	  })
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
			type: "UPDATED_DAY_INTERVAL"
			dayInterval: DayInterval
	  }
	| {
			type: "UPDATED_FREQUENCY"
			frequency: Frequency
	  }
	| {
			type: "STATUS_CHANGED"
			status: BacktestingStatus
	  }
	| (BacktestingSessionUpdatedResultData & {
			type: "UPDATED_RESULT"
	  })
