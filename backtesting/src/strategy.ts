import {
	StrategyFlow,
	StrategyKey,
	StrategyParameters
} from "@workspace/models"

export class BacktestingStrategy {
	readonly params: StrategyParameters
	readonly strategyKey: StrategyKey
	readonly view: StrategyFlow["view"]

	constructor({
		params,
		strategyKey,
		view
	}: Pick<BacktestingStrategy, "params" | "strategyKey" | "view">) {
		this.params = params
		this.strategyKey = strategyKey
		this.view = view
	}
}
