import { DayInterval, isDayInterval } from "@ggbot2/time";
import { Operation } from "./operation.js";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { StrategyDailyOrders } from "./strategyDailyOrders.js";
import { objectTypeGuard } from "@ggbot2/type-utils";

export type ReadStrategyOrders = Operation<
  AccountStrategyKey & DayInterval,
  StrategyDailyOrders
>;

export const isReadStrategyOrdersInput = objectTypeGuard<
  ReadStrategyOrders["in"]
>(
  ({ start, end, ...accountStrategyKey }) =>
    isDayInterval({ start, end }) && isAccountStrategyKey(accountStrategyKey)
);
