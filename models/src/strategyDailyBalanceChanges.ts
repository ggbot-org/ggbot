import { isDay } from "@ggbot2/time";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import type { BalanceChangeEvent } from "./balanceChangeEvent.js";
import type { Operation } from "./operation.js";
import type { DayKey, UpdateTime } from "./time.js";

/** Daily balance changes per strategy. */
export type StrategyDailyBalanceChangesKey = AccountStrategyKey & DayKey;

export const isStrategyDailyBalanceChangesKey = (
  arg: unknown
): arg is StrategyDailyBalanceChangesKey => {
  if (typeof arg !== "object" || arg === null) return false;
  const { day, ...key } = arg as Partial<StrategyDailyBalanceChangesKey>;
  return isDay(day) && isAccountStrategyKey(key);
};

export type ReadStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey,
  BalanceChangeEvent[] | null
>;

export type AppendStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey & { items: BalanceChangeEvent[] },
  UpdateTime
>;
