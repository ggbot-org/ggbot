import { Frequency } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"

import { BacktestingStatus } from "./status.js"

export type BacktestingMessageIn =
	| {
			type: "PAUSE"
	  }
	| {
			type: "RESUME"
	  }
	| {
			type: "START"
	  }
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

export type BacktestingMessageOut = {
	type: "STATUS_CHANGED"
	status: BacktestingStatus
}
