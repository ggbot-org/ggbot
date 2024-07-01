import { StrategyFlowGraph } from "@workspace/models"
import { DflowExecutionReport, DflowNodesCatalog } from "dflow"

import { DflowCommonContext } from "./context.js"
import { DflowCommonHost } from "./host.js"
import { nodesCatalog } from "./nodesCatalog.js"

export type DflowCommonExecutorContext = Omit<
	DflowCommonContext,
	"memoryChanged"
>

export type DflowCommonExecutorOutput = Pick<
	DflowCommonContext,
	"memory" | "memoryChanged"
> & {
	execution: null | DflowExecutionReport
}

export type DflowExecutor<
	RunContext extends DflowCommonExecutorContext,
	RunOutput extends DflowCommonExecutorOutput
> = {
	readonly nodesCatalog: DflowNodesCatalog
	run(context: RunContext, graph: StrategyFlowGraph): Promise<RunOutput>
}

export class DflowCommonExecutor
	implements
		DflowExecutor<DflowCommonExecutorContext, DflowCommonExecutorOutput>
{
	readonly graph: StrategyFlowGraph
	nodesCatalog: DflowNodesCatalog
	constructor({ graph }: Pick<DflowCommonExecutor, "graph">) {
		this.graph = graph
		this.nodesCatalog = nodesCatalog
	}
	async run(context: DflowCommonExecutorContext) {
		const { graph } = this
		const dflow = new DflowCommonHost(
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
export const getDflowExecutionOutputData = (
	execution: undefined | DflowCommonExecutorOutput["execution"],
	nodeId: string,
	outputPosition: number
) => {
	const node = execution?.steps?.find(({ id }) => id === nodeId)
	return node?.o?.[outputPosition]?.d
}
