const backtestingStatuses = ["running", "paused", "ready", "done"] as const
export type BacktestingStatus = (typeof backtestingStatuses)[number]

export type BacktestingStatusController = {
	pause: () => void
	resume: () => void
	start: () => void
	stop: () => void
}
