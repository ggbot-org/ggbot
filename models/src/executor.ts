import { objectTypeGuard } from "@ggbot2/type-utils";
import { Item, isItemId } from "./item.js";
import { CreationTime, isCreationTime } from "./time.js";

export type Executor = Item & CreationTime;

export const isExecutor = objectTypeGuard<Executor>(
  ({ id, ...creationTime }) => isItemId(id) && isCreationTime(creationTime)
);
