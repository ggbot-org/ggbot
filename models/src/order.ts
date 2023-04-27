import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow, DflowObject } from "dflow";
import { Item, NewItem, isItemId, newId } from "./item.js";
import { CreationTime, createdNow, isCreationTime } from "./time.js";

export type Order = Item &
  CreationTime & {
    info: DflowObject;
  };

export const isOrder = objectTypeGuard<Order>(
  ({ id, info, ...creationTime }) =>
    isItemId(id) && isCreationTime(creationTime) && Dflow.isObject(info)
);

export type Orders = Order[];
export const isOrders = arrayTypeGuard<Order>(isOrder);

export const newOrder = ({ info }: NewItem<Order>): Order => ({
  ...createdNow(),
  id: newId(),
  info,
});
