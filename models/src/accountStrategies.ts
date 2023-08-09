import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";

import { AccountKey } from "./account.js";
import {
  AccountStrategy,
  AccountStrategyKey,
  isAccountStrategy,
} from "./accountStrategy.js";
import { isItemId } from "./item.js";
import {
  DeleteOperation,
  Operation,
  ReadOperation,
  UpdateOperation,
} from "./operation.js";
import { isStrategySchedulings } from "./strategyScheduling.js";
import { CreationTime } from "./time.js";

export type AccountStrategies = AccountStrategy[];

export const isAccountStrategies =
  arrayTypeGuard<AccountStrategy>(isAccountStrategy);

export type ReadAccountStrategies = ReadOperation<
  AccountKey,
  AccountStrategy[]
>;

export type InsertAccountStrategiesItem = Operation<
  AccountKey & { item: AccountStrategy },
  CreationTime
>;

export type RenameAccountStrategiesItem = UpdateOperation<
  Omit<AccountStrategyKey, "strategyKind"> & Pick<AccountStrategy, "name">
>;

export type WriteAccountStrategiesItemSchedulings = UpdateOperation<
  Omit<AccountStrategyKey, "strategyKind"> &
    Pick<AccountStrategy, "schedulings">
>;

export const isWriteAccountStrategiesItemSchedulingsInput = objectTypeGuard<
  WriteAccountStrategiesItemSchedulings["in"]
>(
  ({ accountId, strategyId, schedulings }) =>
    isItemId(accountId) &&
    isItemId(strategyId) &&
    isStrategySchedulings(schedulings)
);

export type SuspendAccountStrategiesItemSchedulings = UpdateOperation<
  Omit<AccountStrategyKey, "strategyKind">
>;

export type DeleteAccountStrategiesItem = DeleteOperation<
  Omit<AccountStrategyKey, "strategyKind">
>;

export type SuspendAccountStrategiesSchedulings = UpdateOperation<AccountKey>;
