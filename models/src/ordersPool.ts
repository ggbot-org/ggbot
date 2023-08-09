import { AccountStrategyKey } from "./accountStrategy.js";
import { ReadOperation, UpdateOperation } from "./operation.js";
import { Order } from "./order.js";

/** Contains orders in a temporary state. */
export type OrdersPool = Order[];

export type ReadStrategyOrdersPool = ReadOperation<
  AccountStrategyKey,
  OrdersPool
>;

export type WriteStrategyOrdersPool = UpdateOperation<
  AccountStrategyKey & OrdersPool
>;
