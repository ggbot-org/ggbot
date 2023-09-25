import { AccountStrategyKey, StrategyExecution } from "@workspace/models"

type ExecuteStrategyOutput = Pick<StrategyExecution, "status" | "whenUpdated">

export type ExecuteStrategy = (
	arg: AccountStrategyKey
) => Promise<ExecuteStrategyOutput>
