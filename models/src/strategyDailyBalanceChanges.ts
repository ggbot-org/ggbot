import { isDay } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { BalanceChangeEvents } from "./balanceChangeEvent.js";
import { Operation } from "./operation.js";
import { DayKey, UpdateTime } from "./time.js";

/** Daily balance changes per strategy. */
export type StrategyDailyBalanceChangesKey = AccountStrategyKey & DayKey;

export const isStrategyDailyBalanceChangesKey =
  objectTypeGuard<StrategyDailyBalanceChangesKey>(
    ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
  );

export type ReadStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey,
  BalanceChangeEvents | null
>;

export type AppendStrategyDailyBalanceChanges = Operation<
  StrategyDailyBalanceChangesKey & { items: BalanceChangeEvents },
  UpdateTime
>;
