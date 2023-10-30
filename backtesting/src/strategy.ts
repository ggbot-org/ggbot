import { StrategyFlow,StrategyKey } from "@workspace/models"

export class BacktestingStrategy
	implements StrategyKey, Pick<StrategyFlow, "view">
{
	readonly strategyKind: StrategyKey["strategyKind"]
	readonly strategyId: StrategyKey["strategyId"]

	readonly view: StrategyFlow["view"]

	constructor({
		strategyId,
		strategyKind,
		view
	}: Pick<BacktestingStrategy, "strategyId" | "strategyKind" | "view">) {
		this.strategyId = strategyId
		this.strategyKind = strategyKind
		this.view = view
	}
}
