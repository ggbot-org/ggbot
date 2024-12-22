/**
 * @typedef {import('@workspace/models').Strategy} Strategy
 * @typedef {import('@workspace/models').StrategyKey} StrategyKey
 * @typedef {import('@workspace/models').StrategyFlowGraph} StrategyFlowGraph
 */

export class BacktestingStrategy {
	/**
	 * @param {{
	 *   flow: StrategyFlowGraph
	 *   strategyKey: StrategyKey
	 *   strategyName: Strategy['name']
	 * }} arg
	 */
	constructor({ flow, strategyKey, strategyName }) {
		this.flow = flow
		this.strategyKey = strategyKey
		this.strategyName = strategyName
	}
}
