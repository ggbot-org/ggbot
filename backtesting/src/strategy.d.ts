import { Strategy, StrategyFlowGraph, StrategyKey } from '@workspace/models'

export declare class BacktestingStrategy {
	constructor({
		flow,
		strategyKey,
		strategyName,
	}: Pick<BacktestingStrategy, 'flow' | 'strategyKey' | 'strategyName'>)
	/** The graph of the strategy flow. */
	flow: StrategyFlowGraph
	strategyKey: StrategyKey
	strategyName: Strategy['name']
}
