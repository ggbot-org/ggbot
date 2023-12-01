import { StrategyFlow, StrategyKey } from "@workspace/models"

export class BacktestingStrategy {
	readonly strategyKey: StrategyKey
	view: StrategyFlow["view"]

	constructor({
		strategyKey,
		view
	}: Pick<BacktestingStrategy, "strategyKey" | "view">) {
		this.strategyKey = strategyKey
		this.view = view
	}
}
