import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Item, isItemId, newId } from "./item.js";
import { Scheduling, isScheduling } from "./scheduling.js";

export type StrategyScheduling = Item & Scheduling;

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(
  ({ id, ...scheduling }) => isItemId(id) && isScheduling(scheduling)
);

export const newStrategyScheduling = ({
  frequency,
  status,
}: Pick<StrategyScheduling, "frequency" | "status">): StrategyScheduling => ({
  id: newId(),
  frequency,
  status,
});

export const isStrategySchedulings =
  arrayTypeGuard<StrategyScheduling>(isStrategyScheduling);
