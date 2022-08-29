import { StrategyFlow } from "@ggbot2/models";
import { DflowNodesCatalog } from "dflow";

export interface DflowExecutor<RunInput, RunOutput> {
  readonly view: StrategyFlow["view"];
  nodesCatalog: DflowNodesCatalog;
  prepare(): Promise<void>;
  run(_: RunInput): Promise<RunOutput>;
}
