import { isMaybeObject, objectTypeGuard } from "@ggbot2/type-utils";
import { FlowViewSerializableGraph } from "flow-view";

import { AccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { isStrategyKey, StrategyKey } from "./strategy.js";
import { DeletionTime, isUpdateTime, UpdateTime } from "./time.js";

export type StrategyFlow = UpdateTime & {
  view: FlowViewSerializableGraph;
};

export const isStrategyFlow = objectTypeGuard<StrategyFlow>(
  ({ view, ...updateTime }) =>
    isMaybeObject<FlowViewSerializableGraph>(view) && isUpdateTime(updateTime)
  //TODO is FlowViewSerializableGraph(view)
);

export type CopyStrategyFlow = Operation<
  AccountKey & { source: StrategyKey; target: StrategyKey },
  UpdateTime
>;

export type ReadStrategyFlow = Operation<StrategyKey, StrategyFlow | null>;

export const isReadStrategyFlowInput = objectTypeGuard<ReadStrategyFlow["in"]>(
  (strategyKey) => isStrategyKey(strategyKey)
);

export type WriteStrategyFlow = Operation<
  AccountStrategyKey & Omit<StrategyFlow, "whenUpdated">,
  UpdateTime
>;

//TODO is FlowViewSerializableGraph(view)
export const isWriteStrategyFlowInput = objectTypeGuard<
  WriteStrategyFlow["in"]
>(
  ({ view, ...accountStrategyKey }) =>
    isMaybeObject<FlowViewSerializableGraph>(view) &&
    isAccountStrategyKey(accountStrategyKey)
);

export type DeleteStrategyFlow = Operation<AccountStrategyKey, DeletionTime>;
