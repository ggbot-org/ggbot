import { Day, isDay } from "@ggbot2/time";
import { BalanceChangeEvent, isBalanceChangeEvent } from "./balance.js";
import { StrategyKey, isStrategyKey } from "./strategy.js";

export type StrategyDailyBalance = {
  day: Day;
  strategyKey: StrategyKey;
  changes: BalanceChangeEvent[];
};

export const isStrategyDailyBalance = (
  arg: unknown
): arg is StrategyDailyBalance => {
  if (typeof arg !== "object" || arg === null) return false;
  const { day, changes, strategyKey } = arg as Partial<StrategyDailyBalance>;
  if (!isDay(day) || !Array.isArray(changes) || !isStrategyKey(strategyKey))
    return false;
  return changes.every((change) => isBalanceChangeEvent(change));
};
