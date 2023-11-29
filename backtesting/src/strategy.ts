import {
	StrategyFlow,
	StrategyKey,
	StrategyParameters
} from "@workspace/models"

type SerializableBacktestingStrategy = Pick<
	BacktestingStrategy,
	"params" | "strategyKey" | "view"
>

export class BacktestingStrategy {
	readonly params: StrategyParameters
	readonly strategyKey: StrategyKey
	readonly view: StrategyFlow["view"]

	constructor({
		params,
		strategyKey,
		view
	}: SerializableBacktestingStrategy) {
		this.params = params
		this.strategyKey = strategyKey
		this.view = view
	}

	toValue(): SerializableBacktestingStrategy {
		return {
			params: this.params,
			strategyKey: this.strategyKey,
			view: this.view
		}
	}
}
