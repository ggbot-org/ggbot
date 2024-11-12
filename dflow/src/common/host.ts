import { StrategyFlowGraph } from '@workspace/models'
import { Dflow } from 'dflow'

import { DflowCommonContext } from './context.js'
import { DflowLoader, load } from './loader.js'

export class DflowCommonHost extends Dflow implements DflowLoader {
	constructor(
		arg: ConstructorParameters<typeof Dflow>[0],
		context: DflowCommonContext
	) {
		super(arg)
		this.context.defaults = context.defaults
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}
	load(graph: StrategyFlowGraph): void {
		load({ dflow: this, graph })
	}
}
