import { AccountStrategyKey, StrategyExecution } from "@workspace/models"

export type ExecuteStrategyOutput = Pick<
	StrategyExecution,
	"status" | "whenUpdated"
>

export type ExecuteStrategy = (
	arg: AccountStrategyKey
) => Promise<ExecuteStrategyOutput>
