import { DflowGraphExecutionReport, DflowNodesCatalog } from "dflow"
import { FlowViewSerializableEdge, FlowViewSerializableNode } from "flow-view"

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
	edges: Pick<FlowViewSerializableEdge, "id" | "from" | "to">[]
	nodes: Pick<FlowViewSerializableNode, "id" | "ins" | "outs" | "text">[]
}

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
