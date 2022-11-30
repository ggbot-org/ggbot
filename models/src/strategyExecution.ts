import type { DflowExecutionNodeInfo, DflowGraphRunStatus } from "dflow";
import type { AccountStrategyKey } from "./accountStrategy.js";
import { Balances, isBalances } from "./balance.js";
import { isLiteralType } from "./literalType.js";
import { objectTypeGuard } from "./objects.js";
import type { Operation } from "./operation.js";
import { DeletionTime, UpdateTime, isUpdateTime } from "./time.js";

export type StrategyExecutionStatus = Extract<
  DflowGraphRunStatus,
  "success" | "failure"
>;
export const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>(
  ["success", "failure"]
);

export type StrategyExecution = UpdateTime & {
  /** If a strategy execution do some transaction, the result can be reported as a `balances` attribute. */
  balances: Balances;

  steps: DflowExecutionNodeInfo;

  status: StrategyExecutionStatus;
};

export const isStrategyExecution = objectTypeGuard<StrategyExecution>(
  ({ status, balances, steps, ...updateTime }) =>
    isUpdateTime(updateTime) &&
    isStrategyExecutionStatus(status) &&
    isBalances(balances) &&
    // TODO isDflowExecutionNodeInfo(steps)
    Array.isArray(steps)
);

export type ReadStrategyExecution = Operation<
  AccountStrategyKey,
  StrategyExecution | null
>;

export type ExecuteStrategy = Operation<
  AccountStrategyKey,
  Pick<StrategyExecution, "status" | "whenUpdated">
>;

export type WriteStrategyExecution = Operation<
  AccountStrategyKey & Omit<StrategyExecution, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyExecution = Operation<
  AccountStrategyKey,
  DeletionTime
>;
