export const workersDirname = "workers"

type WorkerName = "backtesting"

export const workerScriptPath: Record<WorkerName, string[]> = {
	backtesting: [workersDirname, "backtesting.js"]
}
