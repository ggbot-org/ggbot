import { AccountKey, isAccountKey } from "./account.js";
import { StrategyKey, isStrategyKey } from "./strategy.js";

export type AccountStrategyKey = AccountKey & StrategyKey;

export const isAccountStrategyKey = (
  arg: unknown
): arg is AccountStrategyKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { accountId, ...strategyKey } = arg as Partial<AccountStrategyKey>;
  return isAccountKey({ accountId }) && isStrategyKey(strategyKey);
};
