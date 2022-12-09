import { objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow, DflowObject } from "dflow";
import { Item, isItemId } from "./item.js";
import { CreationTime, isCreationTime } from "./time.js";

export type Order = Item &
  CreationTime & {
    info: DflowObject;
  };

export const isOrder = objectTypeGuard<Order>(
  ({ id, info, ...creationTime }) =>
    isItemId(id) && isCreationTime(creationTime) && Dflow.isObject(info)
);
