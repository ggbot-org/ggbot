import { StrategyFlowGraph } from "@workspace/models"
import { DflowExecutionReport, DflowNodesCatalog } from "dflow"

import { DflowCommonContext } from "./context.js"

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
	RunContext extends DflowCommonExecutorContext = DflowCommonExecutorContext,
	RunOutput extends DflowCommonExecutorOutput = DflowCommonExecutorOutput
> = {
	readonly nodesCatalog: DflowNodesCatalog
	run(context: RunContext, graph: StrategyFlowGraph): Promise<RunOutput>
}

export const getDflowExecutionOutputData = (
	execution: undefined | DflowCommonExecutorOutput["execution"],
	nodeId: string,
	outputPosition: number
) => {
	const node = execution?.steps?.find(({ id }) => id === nodeId)
	return node?.o?.[outputPosition]?.d
}
