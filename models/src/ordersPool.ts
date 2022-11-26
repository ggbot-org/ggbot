import type { AccountStrategyKey } from "./accountStrategy.js";
import type { Operation } from "./operation.js";
import type { Order } from "./order.js";
import type { UpdateTime } from "./time.js";

/** Contains orders in a temporary state. */
export type OrdersPool = Order[];

export type ReadStrategyOrdersPool = Operation<
  AccountStrategyKey,
  OrdersPool | null
>;

export type WriteStrategyOrdersPool = Operation<
  AccountStrategyKey & OrdersPool,
  UpdateTime
>;
