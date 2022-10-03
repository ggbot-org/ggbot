import type { JsonObject } from "type-fest";
import { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import { DeletionTime, UpdateTime } from "./time.js";

export type StrategyMemory = UpdateTime & {
  memory: JsonObject;
};

export type ReadStrategyMemory = Operation<
  AccountStrategyKey,
  StrategyMemory | null
>;

export type WriteStrategyMemory = Operation<
  AccountStrategyKey & Omit<StrategyMemory, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyMemory = Operation<AccountStrategyKey, DeletionTime>;
