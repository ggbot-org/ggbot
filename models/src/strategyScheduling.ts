import type { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";

export type StrategySchedulingKey = AccountStrategyKey;

export type StrategyScheduling = {
  every: number;
};

export type StrategySchedulingListItem = StrategySchedulingKey &
  StrategyScheduling;

export type ReadStrategySchedulingList = Operation<
  void,
  StrategySchedulingListItem[]
>;
