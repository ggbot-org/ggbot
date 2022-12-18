import { objectTypeGuard } from "@ggbot2/type-utils";
import { isDay } from "@ggbot2/time";
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import type { Order } from "./order.js";
import type { Operation } from "./operation.js";
import type { DayKey, UpdateTime } from "./time.js";

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
