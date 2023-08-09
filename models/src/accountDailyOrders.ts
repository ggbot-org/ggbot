import { isDay } from "@ggbot2/time";
import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";

import { AccountKey, isAccountKey } from "./account.js";
import { ReadOperation, UpdateOperation } from "./operation.js";
import { isOrder, Order } from "./order.js";
import { isStrategyKey, StrategyKey } from "./strategy.js";
import { DayKey } from "./time.js";

export type AccountDailyOrder = StrategyKey & { order: Order };
export const isAccountDailyOrder = objectTypeGuard<AccountDailyOrder>(
  ({ order, ...strategyKey }) => isOrder(order) && isStrategyKey(strategyKey)
);

/** Daily orders per account. */
export type AccountDailyOrders = AccountDailyOrder[];
export const isAccountDailyOrders =
  arrayTypeGuard<AccountDailyOrder>(isAccountDailyOrder);

export type AccountDailyOrdersKey = AccountKey & DayKey;

export const isAccountDailyOrdersKey = objectTypeGuard<AccountDailyOrdersKey>(
  ({ day, ...key }) => isDay(day) && isAccountKey(key)
);

export type ReadAccountDailyOrders = ReadOperation<
  AccountDailyOrdersKey,
  AccountDailyOrders
>;

export type AppendAccountDailyOrders = UpdateOperation<
  AccountDailyOrdersKey & { items: AccountDailyOrders }
>;
