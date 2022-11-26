import type { AccountKey } from "./account.js";
import {
  AccountStrategy,
  AccountStrategyKey,
  isAccountStrategy,
} from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import type { CreationTime, DeletionTime, UpdateTime } from "./time.js";

export type AccountStrategies = AccountStrategy[];

export const isAccountStrategies = (arg: unknown): arg is AccountStrategies =>
  Array.isArray(arg) && arg.every((item) => isAccountStrategy(item));

export type ReadAccountStrategies = Operation<
  AccountKey,
  AccountStrategies | null
>;

export type InsertAccountStrategiesItem = Operation<
  AccountKey & { item: AccountStrategy },
  CreationTime
>;

export type UpdateAccountStrategiesItem = Operation<
  AccountStrategyKey & {
    changes: Partial<Pick<AccountStrategy, "name" | "schedulings">>;
  },
  UpdateTime
>;

export type DeleteAccountStrategiesItem = Operation<
  AccountStrategyKey,
  DeletionTime
>;
