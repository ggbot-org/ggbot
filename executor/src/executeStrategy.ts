import { AccountStrategyKey, StrategyExecution } from "@ggbot2/models"

export type ExecuteStrategyOutput = Pick<
	StrategyExecution,
	"status" | "whenUpdated"
>

export type ExecuteStrategy = (
	arg: AccountStrategyKey
) => Promise<ExecuteStrategyOutput>
