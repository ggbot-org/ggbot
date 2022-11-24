import { isLiteralType } from "./literalType.js";

export const strategySchedulingStatuses = [
  "active",
  "inactive",
  "suspended",
] as const;
export type StrategySchedulingStatus =
  typeof strategySchedulingStatuses[number];

export const isStrategySchedulingStatus =
  isLiteralType<StrategySchedulingStatus>(strategySchedulingStatuses);

export const strategySchedulingIntervals = ["1h"] as const;
export type StrategySchedulingInterval =
  typeof strategySchedulingStatuses[number];
export const isStrategySchedulingInterval =
  isLiteralType<StrategySchedulingInterval>(strategySchedulingIntervals);

export type StrategySchedulingFrequency = {
  every: number;
  interval: StrategySchedulingInterval;
};

export const isStrategySchedulingFrequency = (
  arg: unknown
): arg is StrategySchedulingFrequency => {
  if (typeof arg !== "object" || arg === null) return false;
  const { every, interval } = arg as Partial<StrategySchedulingFrequency>;
  return (
    typeof every === "number" &&
    every > 0 &&
    isStrategySchedulingInterval(interval)
  );
};

export type StrategyScheduling = {
  frequency: StrategySchedulingFrequency;
  status: StrategySchedulingStatus;
};

export const isStrategyScheduling = (
  arg: unknown
): arg is StrategyScheduling => {
  if (typeof arg !== "object" || arg === null) return false;
  const { frequency, status } = arg as Partial<StrategyScheduling>;
  return (
    isStrategySchedulingFrequency(frequency) &&
    isStrategySchedulingStatus(status)
  );
};
