const workersDirname = "workers"

export type WorkerName = "backtesting"

export const workerScriptPath: Record<WorkerName, string[]> = {
	backtesting: [workersDirname, "backtesting.js"]
}
