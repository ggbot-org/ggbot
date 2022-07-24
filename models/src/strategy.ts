import { Item, isItemId } from "./item.js";

export const strategyKinds = ["binance"] as const;

export type StrategyKind = typeof strategyKinds[number];

export const isStrategyKind = (value: unknown): value is StrategyKind => {
  if (typeof value !== "string") return false;
  return (strategyKinds as readonly string[]).includes(value);
};

export type Strategy = Item & {
  readonly kind: StrategyKind;
};

export const isStrategy = (value: unknown): value is StrategyKind => {
  if (typeof value !== "object" || value === null) return false;
  const { id, kind } = value as Partial<Strategy>;
  return isItemId(id) && isStrategyKind(kind);
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
