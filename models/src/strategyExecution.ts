import { isLiteralType } from "./literalType.js";
import type { Operation } from "./operation.js";
import { AccountStrategyKey } from "./strategy.js";
import { DeletionTime, UpdateTime } from "./time.js";

export const strategyExecutionStatuses = ["success", "failure"] as const;
export type StrategyExecutionStatus = typeof strategyExecutionStatuses[number];

export const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>(
  strategyExecutionStatuses
);

export type StrategyExecution = UpdateTime & {
  status: StrategyExecutionStatus;
};

export type ReadStrategyExecution = Operation<
  AccountStrategyKey,
  StrategyExecution | undefined
>;

export type WriteStrategyExecution = Operation<
  AccountStrategyKey & Omit<StrategyExecution, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyExecution = Operation<
  AccountStrategyKey,
  DeletionTime
>;
