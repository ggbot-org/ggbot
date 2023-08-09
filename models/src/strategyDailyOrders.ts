import { isDay } from "@ggbot2/time";
import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { isOrder, Order } from "./order.js";
import { DayKey, UpdateTime } from "./time.js";

export type StrategyDailyOrder = Order;
export const isStrategyDailyOrder = (arg: unknown): arg is StrategyDailyOrder =>
  isOrder(arg);

/** Daily orders per strategy. */
export type StrategyDailyOrders = Order[];
export const isStrategyDailyOrders =
  arrayTypeGuard<StrategyDailyOrder>(isStrategyDailyOrder);

export type StrategyDailyOrdersKey = AccountStrategyKey & DayKey;

export const isStrategyDailyOrdersKey = objectTypeGuard<StrategyDailyOrdersKey>(
  ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
);

export type ReadStrategyDailyOrders = (
  arg: StrategyDailyOrdersKey
) => Promise<StrategyDailyOrders>;

export type AppendStrategyDailyOrdersInput = StrategyDailyOrdersKey & {
  items: StrategyDailyOrders;
};

export type AppendStrategyDailyOrders = (
  arg: AppendStrategyDailyOrdersInput
) => Promise<UpdateTime>;
