import { AccountKey, isAccountKey } from "./account.js";
import { isName } from "./name.js";
import type { Operation } from "./operation.js";
import { Strategy, StrategyKey, isStrategyKey } from "./strategy.js";
import {
  StrategySchedulingStatus,
  isStrategySchedulingStatus,
} from "./strategyScheduling.js";
import type { DeletionTime, UpdateTime } from "./time.js";

export type AccountStrategyKey = AccountKey & StrategyKey;

export const isAccountStrategyKey = (
  arg: unknown
): arg is AccountStrategyKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { accountId, ...strategyKey } = arg as Partial<AccountStrategyKey>;
  return isAccountKey({ accountId }) && isStrategyKey(strategyKey);
};

export type AccountStrategy = StrategyKey &
  Pick<Strategy, "name"> & {
    schedulingStatus: StrategySchedulingStatus;
  };

export const isAccountStrategy = (arg: unknown): arg is AccountStrategy => {
  if (typeof arg !== "object" || arg === null) return false;
  const { name, schedulingStatus, ...strategyKey } =
    arg as Partial<AccountStrategy>;
  return (
    isStrategyKey(strategyKey) &&
    isName(name) &&
    isStrategySchedulingStatus(schedulingStatus)
  );
};

export type AccountStrategies = AccountStrategy[];

export const isAccountStrategies = (arg: unknown): arg is AccountStrategies =>
  Array.isArray(arg) && arg.every((item) => isAccountStrategy(item));

export type ReadAccountStrategies = Operation<
  AccountKey,
  AccountStrategies | null
>;

export type WriteAccountStrategies = Operation<
  AccountKey & { strategies: AccountStrategies },
  UpdateTime
>;

export type DeleteAccountStrategies = Operation<AccountKey, DeletionTime>;
