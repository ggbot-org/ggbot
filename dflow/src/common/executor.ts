import { DflowGraphExecutionReport, DflowNodesCatalog } from "dflow"
import { FlowViewSerializableEdge, FlowViewSerializableNode } from "flow-view"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { DflowCommonContext } from "./context.js"

export type DflowCommonExecutorContext = Omit<
	DflowCommonContext,
	"memoryChanged"
>

export type DflowCommonExecutorOutput = Pick<
	DflowCommonContext,
	"memory" | "memoryChanged"
> & {
	execution: null | DflowGraphExecutionReport
}

/** A subset of `FlowViewSerializableGraph`. */
export type DflowExecutorView = {
	edges: Array<Pick<FlowViewSerializableEdge, "id" | "from" | "to">>
	nodes: Array<Pick<FlowViewSerializableNode, "id" | "ins" | "outs" | "text">>
}

// TODO Improve this
export const isDflowExecutorView = objectTypeGuard<DflowExecutorView>(
	({ edges, nodes }) => Array.isArray(edges) && Array.isArray(nodes)
)

export interface DflowExecutor<
	RunContext extends DflowCommonExecutorContext,
	RunOutput extends DflowCommonExecutorOutput
> {
	readonly nodesCatalog: DflowNodesCatalog
	run(context: RunContext, view: DflowExecutorView): Promise<RunOutput>
}

export const getDflowExecutionOutputData = (
	execution: undefined | DflowCommonExecutorOutput["execution"],
	nodeId: string,
	outputPosition: number
) => {
	const node = execution?.steps?.find(({ id }) => id === nodeId)
	return node?.o?.[outputPosition]?.d
}
