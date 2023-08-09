import { DayInterval, isDayInterval } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { ReadOperation } from "./operation.js";
import { StrategyDailyOrders } from "./strategyDailyOrders.js";

export type ReadStrategyOrders = ReadOperation<
  AccountStrategyKey & DayInterval,
  StrategyDailyOrders
>;

export const isReadStrategyOrdersInput = objectTypeGuard<
  ReadStrategyOrders["in"]
>(
  ({ start, end, ...accountStrategyKey }) =>
    isDayInterval({ start, end }) && isAccountStrategyKey(accountStrategyKey)
);
