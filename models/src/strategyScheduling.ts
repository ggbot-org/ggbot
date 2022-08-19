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

export const isStrategySchedulingInterval = (
  value: unknown
): value is StrategySchedulingInterval => {
  if (typeof value !== "string") return false;
  return (strategySchedulingIntervals as readonly string[]).includes(value);
};

export type StrategySchedulingFrequency = {
  every: number;
  interval: StrategySchedulingInterval;
};

export const isStrategySchedulingFrequency = (
  value: unknown
): value is StrategySchedulingFrequency => {
  if (typeof value !== "object" || value === null) return false;
  const { every, interval } = value as Partial<StrategySchedulingFrequency>;
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
  value: unknown
): value is StrategyScheduling => {
  if (typeof value !== "object" || value === null) return false;
  const { frequency, status } = value as Partial<StrategyScheduling>;
  return (
    isStrategySchedulingFrequency(frequency) &&
    isStrategySchedulingStatus(status)
  );
};
