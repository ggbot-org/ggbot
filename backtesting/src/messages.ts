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

export type BacktestingMessageIn =
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
			type: "SET_FREQUENCY"
			frequency: Frequency
	  }
	| {
			type: "SET_DAY_INTERVAL"
			dayInterval: DayInterval
	  }

export type BacktestingMessageOut =
	| {
			type: "STATUS_CHANGED"
			status: BacktestingStatus
	  }
	| (BacktestingSessionUpdatedResultData & {
			type: "UPDATED_RESULT"
	  })
