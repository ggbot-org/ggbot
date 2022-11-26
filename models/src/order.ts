import { Dflow, DflowObject } from "dflow";
import { Item, isItemId } from "./item.js";
import { CreationTime, isCreationTime } from "./time.js";

export type Order = Item &
  CreationTime & {
    info: DflowObject;
  };

export const isOrder = (arg: unknown): arg is Order => {
  if (typeof arg !== "object" || arg === null) return false;
  const { id, info, whenCreated } = arg as Partial<Order>;
  return isItemId(id) && isCreationTime(whenCreated) && Dflow.isObject(info);
};
