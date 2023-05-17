import { isDay } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { Order } from "./order.js";
import { DayKey, UpdateTime } from "./time.js";

/** Daily orders per strategy. */
export type StrategyDailyOrders = Order[];

export type StrategyDailyOrdersKey = AccountStrategyKey & DayKey;

export const isStrategyDailyOrdersKey = objectTypeGuard<StrategyDailyOrdersKey>(
  ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
);

export type ReadStrategyDailyOrders = Operation<
  StrategyDailyOrdersKey,
  StrategyDailyOrders | null
>;

export type AppendStrategyDailyOrders = Operation<
  StrategyDailyOrdersKey & { items: StrategyDailyOrders },
  UpdateTime
>;
