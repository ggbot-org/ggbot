import { Day, isDay, isTimestamp } from "@ggbot2/time";
import { isBalanceChangeEvent } from "./balance.js";
import { isStrategyKey } from "./strategy.js";
import type { StrategyDailyBalance } from "./strategyDailyBalance.js";

export type AccountDailyBalance = {
  day: Day;
  balances: Omit<StrategyDailyBalance, "day">[];
};

export const isAccountDailyBalance = (
  arg: unknown
): arg is AccountDailyBalance => {
  if (typeof arg !== "object" || arg === null) return false;
  const { day, balances } = arg as Partial<AccountDailyBalance>;
  if (!isDay(day) || !Array.isArray(balances)) return false;
  return balances.every((balance) => {
    if (typeof balance !== "object" || balance === null) return false;
    const { changes, strategyKey } = balance;
    if (!isStrategyKey(strategyKey) || !Array.isArray(changes)) return false;
    return changes.every((change) => {
      if (typeof change !== "object" || change === null) return false;
      const { timestamp, balances: balanceChanges } = change;
      if (!isTimestamp(timestamp) || !Array.isArray(balanceChanges))
        return balanceChanges.every((balanceChange) =>
          isBalanceChangeEvent(balanceChange)
        );
    });
  });
};
