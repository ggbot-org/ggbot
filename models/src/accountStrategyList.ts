import type { AccountKey } from "./account.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import type { Strategy } from "./strategy.js";
import type { StrategyScheduling } from "./strategyScheduling.js";
import type { DeletionTime, UpdateTime } from "./time.js";

export type AccountStrategyListItem = AccountStrategyKey &
  Pick<Strategy, "name"> & {
    scheduling: StrategyScheduling;
  };

export const isAccountStrategyListItem = (
  value: unknown
): value is AccountStrategyListItem => {
  if (typeof value !== "object" || value === null) return false;
  const { name, scheduling, ...accountStrategyKey } =
    value as Partial<AccountStrategyListItem>;
  return isAccountStrategyKey(accountStrategyKey);
};

export type AccountStrategyList = AccountStrategyListItem[];

export const isAccountStrategyList = (
  value: unknown
): value is AccountStrategyList => {
  if (!Array.isArray(value)) return false;
  for (const item of value) {
    if (!isAccountStrategyListItem(item)) return false;
  }
  return true;
};

export type ReadAccountStrategyList = Operation<
  AccountKey,
  AccountStrategyList | undefined
>;

export type WriteAccountStrategyList = Operation<
  AccountKey & { strategies: AccountStrategyList },
  UpdateTime
>;

export type DeleteAccountStrategyList = Operation<AccountKey, DeletionTime>;
