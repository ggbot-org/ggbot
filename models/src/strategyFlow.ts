import { isMaybeObject, objectTypeGuard } from "@ggbot2/type-utils";
import { FlowViewSerializableGraph } from "flow-view";

import { AccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import {
  DeleteOperation,
  Operation,
  ReadOperation,
  UpdateOperation,
} from "./operation.js";
import { isStrategyKey, StrategyKey } from "./strategy.js";
import { CreationTime, isUpdateTime, UpdateTime } from "./time.js";

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
  CreationTime
>;

export type ReadStrategyFlow = ReadOperation<StrategyKey, StrategyFlow>;

export const isReadStrategyFlowInput = objectTypeGuard<ReadStrategyFlow["in"]>(
  (strategyKey) => isStrategyKey(strategyKey)
);

export type WriteStrategyFlow = UpdateOperation<
  AccountStrategyKey & Omit<StrategyFlow, "whenUpdated">
>;

//TODO is FlowViewSerializableGraph(view)
export const isWriteStrategyFlowInput = objectTypeGuard<
  WriteStrategyFlow["in"]
>(
  ({ view, ...accountStrategyKey }) =>
    isMaybeObject<FlowViewSerializableGraph>(view) &&
    isAccountStrategyKey(accountStrategyKey)
);

export type DeleteStrategyFlow = DeleteOperation<AccountStrategyKey>;
