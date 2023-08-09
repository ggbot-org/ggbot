import { Day, DayInterval, isDay, isDayInterval } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import {
  BalanceChangeEvent,
  isBalanceChangeEvents,
} from "./balanceChangeEvent.js";
import { ReadOperation } from "./operation.js";

export type StrategyBalance = { day: Day; data: BalanceChangeEvent[] };

export const isStrategyBalance = objectTypeGuard<StrategyBalance>(
  ({ day, data }) => isDay(day) && isBalanceChangeEvents(data)
);

export type ReadStrategyBalances = ReadOperation<
  AccountStrategyKey & DayInterval,
  { day: Day; data: BalanceChangeEvent[] }[]
>;

export const isReadStrategyBalancesInput = objectTypeGuard<
  ReadStrategyBalances["in"]
>(
  ({ start, end, ...accountStrategyKey }) =>
    isDayInterval({ start, end }) && isAccountStrategyKey(accountStrategyKey)
);
