import { AccountKey, isAccountKey } from "./account.js";
import { isName, normalizeName } from "./name.js";
import { objectTypeGuard } from "./objects.js";
import { Strategy, StrategyKey, isStrategyKey } from "./strategy.js";
import {
  StrategySchedulings,
  isStrategySchedulings,
} from "./strategyScheduling.js";

export type AccountStrategyKey = AccountKey & StrategyKey;

export const isAccountStrategyKey = objectTypeGuard<AccountStrategyKey>(
  ({ accountId, ...strategyKey }) =>
    isAccountKey({ accountId }) && isStrategyKey(strategyKey)
);

export type AccountStrategy = StrategyKey &
  Pick<Strategy, "name"> & {
    schedulings: StrategySchedulings;
  };

export const isAccountStrategy = objectTypeGuard<AccountStrategy>(
  ({ name, schedulings, ...strategyKey }) =>
    isStrategyKey(strategyKey) &&
    isName(name) &&
    isStrategySchedulings(schedulings)
);

export const newAccountStrategy = ({
  name,
  ...strategyKey
}: Pick<
  AccountStrategy,
  "strategyId" | "strategyKind" | "name"
>): AccountStrategy => {
  return {
    ...strategyKey,
    name: normalizeName(name),
    schedulings: [],
  };
};
