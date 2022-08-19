import { isLiteralType } from "./literalType.js";

export const strategyExecutionStatuses = [
  "success",
  "failure",
  "running",
] as const;
export type StrategyExecutionStatus = typeof strategyExecutionStatuses[number];

export const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>(
  strategyExecutionStatuses
);
