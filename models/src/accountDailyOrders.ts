import { isDay } from "@ggbot2/time";
import { AccountKey, isAccountKey } from "./account.js";
import type { Order } from "./order.js";
import type { Operation } from "./operation.js";
import type { StrategyKey } from "./strategy.js";
import type { DayKey, UpdateTime } from "./time.js";
import { objectTypeGuard } from "./objects.js";

/** Daily orders per account. */
export type AccountDailyOrders = (StrategyKey & { order: Order })[];

export type AccountDailyOrdersKey = AccountKey & DayKey;

export const isAccountDailyOrdersKey = objectTypeGuard<AccountDailyOrdersKey>(
  ({ day, ...key }) => isDay(day) && isAccountKey(key)
);

export type ReadAccountDailyOrders = Operation<
  AccountDailyOrdersKey,
  AccountDailyOrders | null
>;

export type AppendAccountDailyOrders = Operation<
  AccountDailyOrdersKey & { items: AccountDailyOrders },
  UpdateTime
>;
