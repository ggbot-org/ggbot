import { Item } from "./item.js";

export const strategyKinds = ["binance"] as const;
export type StrategyKind = typeof strategyKinds[number];

export type Strategy = Item & {
  readonly kind: StrategyKind;
};

export type StrategyKey = Readonly<{
  strategyId: Strategy["id"];
  strategyKind: Strategy["kind"];
}>;
