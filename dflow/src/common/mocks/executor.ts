import { StrategyFlowGraph } from "@workspace/models"
import { DflowNodesCatalog } from "dflow"

import { DflowCommonContext } from "../context.js"
import {
	DflowCommonExecutorContext,
	DflowCommonExecutorOutput,
	DflowExecutor
} from "../executor.js"
import { nodesCatalog } from "../nodesCatalog.js"
import { DflowCommonHostMock } from "./host.js"

export class DflowExecutorMock
	implements
		DflowExecutor<DflowCommonExecutorContext, DflowCommonExecutorOutput>
{
	readonly graph: StrategyFlowGraph
	nodesCatalog: DflowNodesCatalog
	constructor({ graph }: Pick<DflowExecutorMock, "graph">) {
		this.graph = graph
		this.nodesCatalog = nodesCatalog
	}
	async run(context: DflowCommonExecutorContext) {
		const { graph } = this
		const dflow = new DflowCommonHostMock(
			{ nodesCatalog: this.nodesCatalog },
			context
		)
		dflow.load(graph)
		await dflow.run()
		const execution = dflow.executionReport
		const { memory, memoryChanged } = dflow.context as DflowCommonContext
		return {
			execution,
			memory,
			memoryChanged
		}
	}
}
