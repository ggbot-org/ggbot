import { Balance, Order, StrategyFlowGraph } from '@workspace/models'
import { DflowData, DflowExecutionReport, DflowNodesCatalog } from 'dflow'

import { DflowCommonContext } from './context'

export type DflowCommonExecutorContext = Omit<DflowCommonContext, 'defaults' | 'memoryChanged'>

type DflowExecutorOutput = Pick<DflowCommonContext, 'memory' | 'memoryChanged'> & {
	balance: Balance;
	execution: null | DflowExecutionReport;
	orders: Array<Pick<Order, 'info'>>;
}

export type DflowExecutor<RunContext extends DflowCommonExecutorContext> = {
	nodesCatalog: DflowNodesCatalog;
	run(context: RunContext, graph: StrategyFlowGraph): Promise<DflowExecutorOutput>;
}

// TODO is the interface needed?

export declare class DflowCommonExecutor implements DflowExecutor<DflowCommonExecutorContext> {
	graph: StrategyFlowGraph
	nodesCatalog: DflowNodesCatalog
	constructor(graph: StrategyFlowGraph)
	run(context: DflowCommonExecutorContext): Promise<{
		balance: never[];
		execution: DflowExecutionReport | null;
		memory: import('@workspace/models').StrategyMemory;
		memoryChanged: boolean | undefined;
		orders: never[];
	}>
}

export declare function getDflowExecutionOutputData(execution: undefined | DflowExecutorOutput['execution'], nodeId: string, outputPosition: number): DflowData | undefined
