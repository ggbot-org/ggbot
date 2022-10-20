import { DflowGraphExecutionReport, DflowNodesCatalog } from "dflow";
import { FlowViewSerializableEdge, FlowViewSerializableNode } from "flow-view";
import { DflowCommonContext } from "./context.js";

export type DflowCommonExecutorInput = Omit<
  DflowCommonContext,
  "memoryChanged"
>;

export type DflowCommonExecutorOutput = Pick<
  DflowCommonContext,
  "memory" | "memoryChanged"
> & {
  execution: DflowGraphExecutionReport;
};

/**
 * Is a subset of `FlowViewSerializableGraph`.
 */
export type DflowExecutorView = {
  edges: Pick<FlowViewSerializableEdge, "id" | "from" | "to">[];
  nodes: Pick<FlowViewSerializableNode, "id" | "ins" | "outs" | "text">[];
};

export interface DflowExecutor<
  RunInput extends DflowCommonExecutorInput,
  RunOutput extends DflowCommonExecutorOutput
> {
  readonly view: DflowExecutorView;
  readonly nodesCatalog: DflowNodesCatalog;
  run(_: RunInput): Promise<RunOutput>;
}

export const getDflowExecutionOutputData = (
  execution: undefined | DflowCommonExecutorOutput["execution"],
  nodeId: string,
  outputPosition: number
) => {
  const node = execution?.steps?.find(({ id }) => id === nodeId);
  return node?.outputs?.[outputPosition]?.data;
};
