import { DayInterval, isDayInterval } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { StrategyDailyOrders } from "./strategyDailyOrders.js";

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
