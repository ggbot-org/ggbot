import { Item, isItemId } from "./item.js";
import { Scheduling, isScheduling } from "./scheduling.js";

export type StrategyScheduling = Item & Scheduling;

export const isStrategyScheduling = (
  arg: unknown
): arg is StrategyScheduling => {
  if (typeof arg !== "object" || arg === null) return false;
  const { id, ...scheduling } = arg as Partial<StrategyScheduling>;
  return isItemId(id) && isScheduling(scheduling);
};
