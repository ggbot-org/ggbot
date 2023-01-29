import { AccountStrategyKey } from "./accountStrategy.js";
import { Operation } from "./operation.js";
import { Order } from "./order.js";
import { UpdateTime } from "./time.js";

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
