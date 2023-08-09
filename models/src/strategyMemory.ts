import { DflowObject } from "dflow";

import { AccountStrategyKey } from "./accountStrategy.js";
import {
  DeleteOperation,
  ReadOperation,
  UpdateOperation,
} from "./operation.js";
import { UpdateTime } from "./time.js";

export type StrategyMemory = UpdateTime & {
  memory: DflowObject;
};

export type ReadStrategyMemory = ReadOperation<
  AccountStrategyKey,
  StrategyMemory
>;

export type WriteStrategyMemory = UpdateOperation<
  AccountStrategyKey & Omit<StrategyMemory, "whenUpdated">
>;

export type DeleteStrategyMemory = DeleteOperation<AccountStrategyKey>;
