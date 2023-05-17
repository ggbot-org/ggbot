import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { DflowExecutionNodeInfo, DflowGraph } from "dflow";

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js";
import { Balances, isBalances } from "./balance.js";
import { Operation } from "./operation.js";
import { DeletionTime, isUpdateTime, UpdateTime } from "./time.js";

export type StrategyExecutionStatus = Extract<
  DflowGraph["runStatus"],
  "success" | "failure"
>;
export const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>(
  ["success", "failure"]
);

export type StrategyExecution = UpdateTime & {
  /**
   * If a strategy execution do some transaction, the result can be reported as
   * a `balances` attribute.
   */
  balances: Balances;

  steps: DflowExecutionNodeInfo[];

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

export const isExecuteStrategyInput = objectTypeGuard<ExecuteStrategy["in"]>(
  (accountStrategyKey) => isAccountStrategyKey(accountStrategyKey)
);

export type WriteStrategyExecution = Operation<
  AccountStrategyKey & Omit<StrategyExecution, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyExecution = Operation<
  AccountStrategyKey,
  DeletionTime
>;
