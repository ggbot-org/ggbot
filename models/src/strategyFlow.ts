import type { FlowViewSerializableGraph } from "flow-view";
import { AccountKey } from "./account.js";
import { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import { StrategyKey } from "./strategy.js";
import { DeletionTime, UpdateTime } from "./time.js";

export type StrategyFlow = UpdateTime & {
  view: FlowViewSerializableGraph;
};

export type CopyStrategyFlow = Operation<
  AccountKey & { source: StrategyKey; target: StrategyKey },
  UpdateTime
>;

export type ReadStrategyFlow = Operation<StrategyKey, StrategyFlow | undefined>;

export type WriteStrategyFlow = Operation<
  AccountStrategyKey & Omit<StrategyFlow, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyFlow = Operation<AccountStrategyKey, DeletionTime>;
