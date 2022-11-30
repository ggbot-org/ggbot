import { Dflow, DflowObject } from "dflow";
import { Item, isItemId } from "./item.js";
import { objectTypeGuard } from "./objects.js";
import { CreationTime, isCreationTime } from "./time.js";

export type Order = Item &
  CreationTime & {
    info: DflowObject;
  };

export const isOrder = objectTypeGuard<Order>(
  ({ id, info, ...creationTime }) =>
    isItemId(id) && isCreationTime(creationTime) && Dflow.isObject(info)
);
