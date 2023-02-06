import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";
import { Item, isItemId, newId } from "./item.js";
import { Scheduling, isScheduling } from "./scheduling.js";
import { StrategyInput, isStrategyInput } from "./strategyInput.js";

export type StrategyScheduling = Item &
  Scheduling & {
    input?: StrategyInput;
  };

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(({ id, input, ...scheduling }) =>
  isItemId(id) && isScheduling(scheduling) && input === undefined ? true : isStrategyInput(input)
);

export const newStrategyScheduling = ({
  frequency,
  status,
}: Pick<StrategyScheduling, "frequency" | "status">): StrategyScheduling => ({
  id: newId(),
  frequency,
  status,
});

export const isStrategySchedulings = arrayTypeGuard<StrategyScheduling>(isStrategyScheduling);
