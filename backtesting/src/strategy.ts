import { Strategy, StrategyFlowGraph, StrategyKey } from "@workspace/models"

export class BacktestingStrategy {
	/** The graph of the strategy flow. */
	flow: StrategyFlowGraph

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
