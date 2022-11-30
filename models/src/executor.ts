import { Item, isItemId } from "./item.js";
import { objectTypeGuard } from "./objects.js";
import { CreationTime, isCreationTime } from "./time.js";

export type Executor = Item & CreationTime;

export const isExecutor = objectTypeGuard<Executor>(
  ({ id, ...creationTime }) => isItemId(id) && isCreationTime(creationTime)
);
