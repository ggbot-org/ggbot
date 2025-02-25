export type BacktestingStatus = 'done' | 'initial' | 'paused' | 'running'

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
