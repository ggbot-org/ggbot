import { AccountKey } from "./account.js";
import { Item, isItemId, NewItem } from "./item.js";
import type { Operation } from "./operation.js";
import { Name, isName } from "./string.js";
import { CreationTime, DeletionTime } from "./time.js";

export { Name as StrategyName, isName as isStrategyName } from "./string.js";

export const strategyKinds = ["binance"] as const;

export type StrategyKind = typeof strategyKinds[number];

export const isStrategyKind = (value: unknown): value is StrategyKind => {
  if (typeof value !== "string") return false;
  return (strategyKinds as readonly string[]).includes(value);
};

export type Strategy = Item &
  CreationTime &
  AccountKey & {
    readonly kind: StrategyKind;
    name: Name;
  };

export const isStrategy = (value: unknown): value is StrategyKind => {
  if (typeof value !== "object" || value === null) return false;
  const { id, kind, name } = value as Partial<Strategy>;
  return isItemId(id) && isStrategyKind(kind) && isName(name);
};

export type StrategyKey = Readonly<{
  strategyId: Strategy["id"];
  strategyKind: Strategy["kind"];
}>;

export const isStrategyKey = (value: unknown): value is StrategyKey => {
  if (typeof value !== "object" || value === null) return false;
  const { strategyId, strategyKind } = value as Partial<StrategyKey>;
  return isItemId(strategyId) && isStrategyKind(strategyKind);
};

export type CreateStrategy = Operation<NewItem<Strategy>, Strategy>;

export type ReadStrategy = Operation<StrategyKey, Strategy | undefined>;

export type ReadStrategyKeys = Operation<void, StrategyKey[]>;

export type DeleteStrategy = Operation<StrategyKey, DeletionTime>;
