import { Strategy, StrategyFlow, StrategyKey } from "@workspace/models"

export class BacktestingStrategy {
	flow: StrategyFlow["view"]
	readonly strategyKey: StrategyKey
	readonly strategyName: Strategy["name"]

	constructor({
		flow,
		strategyKey,
		strategyName
	}: Pick<BacktestingStrategy, "flow" | "strategyKey" | "strategyName">) {
		this.flow = flow
		this.strategyKey = strategyKey
		this.strategyName = strategyName
	}
}
