import { accountKey } from "./account_test.js"
import { AccountStrategyKey } from "./accountStrategy.js"
import { strategyKey } from "./strategy_test.js"

export const accountStrategyKey: AccountStrategyKey = {
	...accountKey,
	...strategyKey
}
