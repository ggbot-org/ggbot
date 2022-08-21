import type { JsonObject } from "type-fest";
import type { Operation } from "./operation.js";
import { AccountStrategyKey } from "./strategy.js";
import { DeletionTime, UpdateTime } from "./time.js";

export type StrategyMemory = UpdateTime & {
  memory: JsonObject;
};

export type ReadStrategyMemory = Operation<
  AccountStrategyKey,
  StrategyMemory | undefined
>;

export type WriteStrategyMemory = Operation<
  AccountStrategyKey & Omit<StrategyMemory, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyMemory = Operation<AccountStrategyKey, DeletionTime>;
