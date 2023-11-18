import {
	adminDirname,
	designDirname,
	userDirname,
	workersDirname
} from "./dirnames.js"

export type EcmaScriptName =
	| "admin"
	| "backtesting"
	| "design"
	| "landing"
	| "strategy"
	| "user"

export const ecmaScriptPath: Record<EcmaScriptName, string[]> = {
	landing: ["landing.js"],
	strategy: ["strategy.js"],
	user: [userDirname, "app.js"],
	admin: [adminDirname, "app.js"],
	design: [designDirname, "app.js"],
	backtesting: [workersDirname, "backtesting.js"]
}
