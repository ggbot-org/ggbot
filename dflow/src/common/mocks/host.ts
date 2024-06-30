import { StrategyFlowGraph } from "@workspace/models"
import { Dflow, DflowConstructorArg } from "dflow"

import { DflowCommonExecutorContext } from "../executor.js"
import { DflowLoader, load } from "../loader.js"
import { commonNodeTextToDflowKind } from "../nodeResolution.js"

export class DflowCommonHostMock extends Dflow implements DflowLoader {
	constructor(arg: DflowConstructorArg, context: DflowCommonExecutorContext) {
		super(arg)
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}
	load(graph: StrategyFlowGraph): void {
		load({
			dflow: this,
			nodeTextToDflowKind: commonNodeTextToDflowKind,
			graph
		})
	}
}
