import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Item, isItemId } from "./item.js";
import { Scheduling, isScheduling } from "./scheduling.js";

export type StrategyScheduling = Item & Scheduling;

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(
  ({ id, ...scheduling }) => isItemId(id) && isScheduling(scheduling)
);

export type StrategySchedulings = StrategyScheduling[];

export const isStrategySchedulings =
  arrayTypeGuard<StrategyScheduling>(isStrategyScheduling);
