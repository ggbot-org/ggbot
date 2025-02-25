import { Balance, Order, StrategyFlowGraph } from '@workspace/models'
import { DflowExecutionReport, DflowNodesCatalog } from 'dflow'

import { DflowCommonContext } from './context.js'
import { DflowCommonHost } from './host.js'
import { nodesCatalog } from './nodesCatalog.js'

export type DflowCommonExecutorContext = Omit<
	DflowCommonContext,
	'defaults' | 'memoryChanged'
>

type DflowExecutorOutput = Pick<
	DflowCommonContext,
	'memory' | 'memoryChanged'
> & {
	balance: Balance
	execution: null | DflowExecutionReport
	orders: Array<Pick<Order, 'info'>>
}

export type DflowExecutor<RunContext extends DflowCommonExecutorContext> = {
	nodesCatalog: DflowNodesCatalog
	run(
		context: RunContext,
		graph: StrategyFlowGraph
	): Promise<DflowExecutorOutput>
}

export class DflowCommonExecutor
	implements DflowExecutor<DflowCommonExecutorContext>
{
	graph: StrategyFlowGraph
	nodesCatalog: DflowNodesCatalog
	constructor(graph: StrategyFlowGraph) {
		this.graph = graph
		this.nodesCatalog = nodesCatalog
	}
	async run(context: DflowCommonExecutorContext) {
		const { graph } = this
		const dflow = new DflowCommonHost(
			{ nodesCatalog: this.nodesCatalog },
			{ defaults: {}, ...context }
		)
		dflow.load(graph)
		await dflow.run()
		const execution = dflow.executionReport
		const { memory, memoryChanged } = dflow.context as DflowCommonContext
		return {
			balance: [],
			execution,
			memory,
			memoryChanged,
			orders: [],
		}
	}
}
export const getDflowExecutionOutputData = (
	execution: undefined | DflowExecutorOutput['execution'],
	nodeId: string,
	outputPosition: number
) => {
	const node = execution?.steps?.find(({ id }) => id === nodeId)
	return node?.o?.[outputPosition]?.d
}
