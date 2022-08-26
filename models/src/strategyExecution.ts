import type { DflowExecutionNodeInfo, DflowGraphRunStatus } from "dflow";
import { AccountStrategyKey } from "./accountStrategy.js";
import { Balance } from "./balance.js";
import { isLiteralType } from "./literalType.js";
import type { Operation } from "./operation.js";
import { DeletionTime, UpdateTime } from "./time.js";

export type StrategyExecutionStatus = Extract<
  DflowGraphRunStatus,
  "success" | "failure"
>;
export const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>(
  ["success", "failure"]
);

export type StrategyExecution = UpdateTime & {
  /**
   * If a strategy execution do some transaction, the result can be reported as a `balances` attribute.
   */
  balances: Balance[];

  steps: DflowExecutionNodeInfo;

  status: StrategyExecutionStatus;
};

export type ReadStrategyExecution = Operation<
  AccountStrategyKey,
  StrategyExecution | undefined
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
