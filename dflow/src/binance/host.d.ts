import { StrategyFlowGraph } from '@workspace/models'
import { Dflow } from 'dflow'

import { DflowLoader } from '../common/loader'
import { DflowBinanceContext } from './context'

/**
 * `DflowBinanceHost` extends `DflowHost` adding an instance of Binance client to the context.
 */
export declare class DflowBinanceHost extends Dflow implements DflowLoader {
	constructor(arg: ConstructorParameters<typeof Dflow>[0], context: Omit<DflowBinanceContext, 'memoryChanged'>)
	load(graph: StrategyFlowGraph): void
}
