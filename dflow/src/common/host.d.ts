import { StrategyFlowGraph } from '@workspace/models'
import { Dflow } from 'dflow'

import { DflowCommonContext } from './context'
import { DflowLoader } from './loader'

export declare class DflowCommonHost extends Dflow implements DflowLoader {
	constructor(arg: ConstructorParameters<typeof Dflow>[0], context: DflowCommonContext)
	context: DflowCommonContext
	load(graph: StrategyFlowGraph): void
}
