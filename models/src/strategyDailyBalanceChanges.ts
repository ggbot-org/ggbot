import { isDay } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { BalanceChangeEvents } from "./balanceChangeEvent.js";
import { DayKey, UpdateTime } from "./time.js";

/** Daily balance changes per strategy. */
export type StrategyDailyBalanceChangesKey = AccountStrategyKey & DayKey;

export const isStrategyDailyBalanceChangesKey =
  objectTypeGuard<StrategyDailyBalanceChangesKey>(
    ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
  );

export type ReadStrategyDailyBalanceChanges = (
  arg: StrategyDailyBalanceChangesKey
) => Promise<BalanceChangeEvents>;

export type AppendStrategyDailyBalanceChangesInput =
  StrategyDailyBalanceChangesKey & { items: BalanceChangeEvents };

export type AppendStrategyDailyBalanceChanges = (
  arg: AppendStrategyDailyBalanceChangesInput
) => Promise<UpdateTime>;
