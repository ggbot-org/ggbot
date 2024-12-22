import {DflowCommonHost} from './host.js'
import {nodesCatalog} from './nodesCatalog.js'

/**
 * @typedef {import('@workspace/models').StrategyFlowGraph} StrategyFlowGraph
 */

/**
 * @typedef {import('./executor').DflowCommonExecutorContext} DflowCommonExecutorContext
 */

export class DflowCommonExecutor /* TODO is it needed? implements DflowExecutor<DflowCommonExecutorContext> */ {
	/** @param {StrategyFlowGraph} graph */
	constructor(graph) {
		this.graph = graph
		this.nodesCatalog = nodesCatalog
	}
	/** @type {import('./executor').DflowCommonExecutor['run']} */
	async run(context) {
		const {graph} = this
		const dflow = new DflowCommonHost(
			{nodesCatalog: this.nodesCatalog},
			{defaults: {}, ...context}
		)
		dflow.load(graph)
		await dflow.run()
		const execution = dflow.executionReport
		const {memory, memoryChanged} = dflow.context
		return {
			balance: [],
			execution,
			memory,
			memoryChanged,
			orders: [],
		}
	}
}

/** @type {import('./executor').getDflowExecutionOutputData} */
export function getDflowExecutionOutputData(execution, nodeId, outputPosition) {
	const node = execution?.steps?.find(({id}) => id === nodeId)
	return node?.o?.[outputPosition]?.d
}
