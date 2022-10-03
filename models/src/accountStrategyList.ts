import type { AccountKey } from "./account.js";
import { isName } from "./name.js";
import type { Operation } from "./operation.js";
import { Strategy, StrategyKey, isStrategyKey } from "./strategy.js";
import {
  StrategySchedulingStatus,
  isStrategySchedulingStatus,
} from "./strategyScheduling.js";
import type { DeletionTime, UpdateTime } from "./time.js";

export type AccountStrategyListItem = StrategyKey &
  Pick<Strategy, "name"> & {
    schedulingStatus: StrategySchedulingStatus;
  };

export const isAccountStrategyListItem = (
  value: unknown
): value is AccountStrategyListItem => {
  if (typeof value !== "object" || value === null) return false;
  const { name, schedulingStatus, ...strategyKey } =
    value as Partial<AccountStrategyListItem>;
  return (
    isStrategyKey(strategyKey) &&
    isName(name) &&
    isStrategySchedulingStatus(schedulingStatus)
  );
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
  AccountStrategyList | null
>;

export type WriteAccountStrategyList = Operation<
  AccountKey & { strategies: AccountStrategyList },
  UpdateTime
>;

export type DeleteAccountStrategyList = Operation<AccountKey, DeletionTime>;
