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
  arg: unknown
): arg is AccountStrategyListItem => {
  if (typeof arg !== "object" || arg === null) return false;
  const { name, schedulingStatus, ...strategyKey } =
    arg as Partial<AccountStrategyListItem>;
  return (
    isStrategyKey(strategyKey) &&
    isName(name) &&
    isStrategySchedulingStatus(schedulingStatus)
  );
};

export type AccountStrategyList = AccountStrategyListItem[];

export const isAccountStrategyList = (
  arg: unknown
): arg is AccountStrategyList =>
  Array.isArray(arg) && arg.every((item) => isAccountStrategyList(item));

export type ReadAccountStrategyList = Operation<
  AccountKey,
  AccountStrategyList | null
>;

export type WriteAccountStrategyList = Operation<
  AccountKey & { strategies: AccountStrategyList },
  UpdateTime
>;

export type DeleteAccountStrategyList = Operation<AccountKey, DeletionTime>;
