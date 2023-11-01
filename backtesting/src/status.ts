const backtestingStatuses = ["done", "initial", "paused", "running"] as const
export type BacktestingStatus = (typeof backtestingStatuses)[number]

/**
 * Methods to modify a `BacktestingStatus`, every method must return true if
 * status changed.
 */
export type BacktestingStatusController = {
	pause: () => boolean
	resume: () => boolean
	start: () => boolean
	stop: () => boolean
}
