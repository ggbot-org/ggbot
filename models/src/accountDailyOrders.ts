import { isDay } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";

import { AccountKey, isAccountKey } from "./account.js";
import { Operation } from "./operation.js";
import { Order } from "./order.js";
import { StrategyKey } from "./strategy.js";
import { DayKey, UpdateTime } from "./time.js";

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
