import { Day, DayInterval, isDay } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";
import {
  BalanceChangeEvent,
  isBalanceChangeEvents,
} from "./balanceChangeEvent.js";
import type { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";

export type StrategyBalance = { day: Day; data: BalanceChangeEvent[] };

export const isStrategyBalance = objectTypeGuard<StrategyBalance>(
  ({ day, data }) => isDay(day) && isBalanceChangeEvents(data)
);

export type ReadStrategyBalances = Operation<
  AccountStrategyKey & DayInterval,
  { day: Day; data: BalanceChangeEvent[] }[]
>;
