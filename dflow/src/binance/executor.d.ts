import { StrategyFlowGraph } from '@workspace/models'
import { DflowNodesCatalog } from 'dflow'

import { DflowCommonExecutorContext, DflowExecutor } from '../common/executor'
import { DflowBinanceClient } from './client'

type DflowBinanceExecutorContext = DflowCommonExecutorContext & {
	binance: DflowBinanceClient;
}

export declare class DflowBinanceExecutor implements DflowExecutor<DflowBinanceExecutorContext> {
	nodesCatalog: DflowNodesCatalog
	constructor()
	/** Execute flow on given context. */
	run(context: DflowBinanceExecutorContext, graph: StrategyFlowGraph): Promise<{
		balance: import('@workspace/models').Balance;
		execution: import('dflow').DflowExecutionReport | null;
		memory: import('@workspace/models').StrategyMemory;
		memoryChanged: boolean | undefined;
		orders: {
			info: import('@workspace/binance').BinanceOrder;
		}[];
	}>
}
