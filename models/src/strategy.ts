import { Item, isItem, isItemId } from "./item.js";

export const strategyKinds = ["binance"] as const;

export type StrategyKind = typeof strategyKinds[number];

export function isStrategyKind(value: unknown): value is StrategyKind {
  if (typeof value !== "string") return false;
  return (strategyKinds as readonly string[]).includes(value);
}

export type Strategy = Item & {
  readonly kind: StrategyKind;
};

export function isStrategy(value: unknown): value is StrategyKind {
  if (!isItem(value)) return false;
  const { kind } = value as Partial<Strategy>;
  return isStrategyKind(kind);
}

export type StrategyKey = Readonly<{
  strategyId: Strategy["id"];
  strategyKind: Strategy["kind"];
}>;

export function isStrategyKey(value: unknown): value is StrategyKey {
  if (typeof value !== "object" || value === null) return false;
  const { strategyId, strategyKind } = value as Partial<StrategyKey>;
  return isItemId(strategyId) && isStrategyKind(strategyKind);
}
