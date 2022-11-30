import { isDay } from "@ggbot2/time";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import type { BalanceChangeEvent } from "./balanceChangeEvent.js";
import { objectTypeGuard } from "./objects.js";
import type { Operation } from "./operation.js";
import type { DayKey, UpdateTime } from "./time.js";

/** Daily balance changes per strategy. */
export type StrategyDailyBalanceChangesKey = AccountStrategyKey & DayKey;

export const isStrategyDailyBalanceChangesKey =
  objectTypeGuard<StrategyDailyBalanceChangesKey>(
    ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
  );

export type ReadStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey,
  BalanceChangeEvent[] | null
>;

export type AppendStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey & { items: BalanceChangeEvent[] },
  UpdateTime
>;
