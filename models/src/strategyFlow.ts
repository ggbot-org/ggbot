import type { FlowViewSerializableGraph } from "flow-view";
import type { AccountKey } from "./account.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import type { StrategyKey } from "./strategy.js";
import type { DeletionTime, UpdateTime } from "./time.js";

export type StrategyFlow = UpdateTime & {
  view: FlowViewSerializableGraph;
};

export type CopyStrategyFlow = Operation<
  AccountKey & { source: StrategyKey; target: StrategyKey },
  UpdateTime
>;

export type ReadStrategyFlow = Operation<StrategyKey, StrategyFlow | null>;

export type WriteStrategyFlow = Operation<
  AccountStrategyKey & Omit<StrategyFlow, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyFlow = Operation<AccountStrategyKey, DeletionTime>;
