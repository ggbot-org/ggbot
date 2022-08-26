import { Balance, StrategyFlow } from "@ggbot2/models";
import { DflowNodesCatalog } from "dflow";
import { DflowCommonContext } from "./context.js";

export interface DflowExecutor {
  readonly view: StrategyFlow["view"];
  nodesCatalog: DflowNodesCatalog;
  prepare(): Promise<void>;
  run(_: Pick<DflowCommonContext, "memory">): Promise<
    Pick<DflowCommonContext, "memory" | "memoryChanged"> & {
      balances: Balance[];
    }
  >;
}
