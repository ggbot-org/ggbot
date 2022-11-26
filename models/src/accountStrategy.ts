import { AccountKey, isAccountKey } from "./account.js";
import { isName } from "./name.js";
import { Strategy, StrategyKey, isStrategyKey } from "./strategy.js";
import {
  StrategyScheduling,
  isStrategyScheduling,
} from "./strategyScheduling.js";

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
    schedulings: StrategyScheduling[];
  };

export const isAccountStrategy = (arg: unknown): arg is AccountStrategy => {
  if (typeof arg !== "object" || arg === null) return false;
  const { name, schedulings, ...strategyKey } = arg as Partial<AccountStrategy>;
  if (!isStrategyKey(strategyKey) || !isName(name)) return false;
  return (
    Array.isArray(schedulings) &&
    schedulings.every((item) => isStrategyScheduling(item))
  );
};
