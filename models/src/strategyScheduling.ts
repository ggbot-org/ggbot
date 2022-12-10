import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Item, isItemId, newId } from "./item.js";
import { Scheduling, isScheduling } from "./scheduling.js";

export type StrategyScheduling = Item & Scheduling;

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(
  ({ id, ...scheduling }) => isItemId(id) && isScheduling(scheduling)
);

export const newStrategyScheduling = ({
  frequency,
}: Pick<StrategyScheduling, "frequency">): StrategyScheduling => ({
  id: newId(),
  frequency,
  status: "active",
});

export type StrategySchedulings = StrategyScheduling[];

export const isStrategySchedulings =
  arrayTypeGuard<StrategyScheduling>(isStrategyScheduling);
