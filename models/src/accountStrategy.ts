import { AccountKey, isAccountKey } from "./account.js";
import { StrategyKey, isStrategyKey } from "./strategy.js";

export type AccountStrategyKey = AccountKey & StrategyKey;

export const isAccountStrategyKey = (
  value: unknown
): value is AccountStrategyKey => {
  if (typeof value !== "object" || value === null) return false;
  const { accountId, ...strategyKey } = value as Partial<AccountStrategyKey>;
  return isAccountKey({ accountId }) && isStrategyKey(strategyKey);
};
