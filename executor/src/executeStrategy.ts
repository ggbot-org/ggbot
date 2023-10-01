import { AccountStrategyKey } from "@workspace/models"

export type ExecuteStrategy = (arg: AccountStrategyKey) => Promise<void>
