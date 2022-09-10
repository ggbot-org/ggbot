import { DflowGraphExecutionReport, DflowNodesCatalog } from "dflow";
import { FlowViewSerializableEdge, FlowViewSerializableNode } from "flow-view";
import { DflowCommonContext } from "./context.js";

export type DflowCommonExecutorInput = Pick<DflowCommonContext, "memory">;

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
  nodesCatalog: DflowNodesCatalog;
  prepare(): Promise<void>;
  run(_: RunInput): Promise<RunOutput>;
}
