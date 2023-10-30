export type BacktestingMessageIn =
	| {
			type: "PAUSE"
	  }
	| {
			type: "START"
	  }
	| {
			type: "STOP"
	  }

export type BacktestingMessageOut = {
	type: "DONE"
}
