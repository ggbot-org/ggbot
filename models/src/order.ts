import { Dflow, DflowObject } from "dflow";
import type { AccountStrategyKey } from "./accountStrategy.js";
import { Item, isItemId } from "./item.js";
import type { Operation } from "./operation.js";
import { CreationTime, UpdateTime, isCreationTime } from "./time.js";

export type Order = Item &
  CreationTime & {
    info: DflowObject;
  };

export const isOrder = (arg: unknown): arg is Order => {
  if (typeof arg !== "object" || arg === null) return false;
  const { id, info, whenCreated } = arg as Partial<Order>;
  return isItemId(id) && isCreationTime(whenCreated) && Dflow.isObject(info);
};

/** Contains all orders in a temporary state. */
export type OrdersPool = Order[];

export type ReadStrategyOrdersPool = Operation<
  AccountStrategyKey,
  OrdersPool | null
>;

export type WriteStrategyOrdersPool = Operation<
  AccountStrategyKey & OrdersPool,
  UpdateTime
>;
