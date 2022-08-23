import { Timestamp } from "@ggbot2/time";
import type { DflowExecutionNodeInfo, DflowGraphRunStatus } from "dflow";
import { AccountStrategyKey } from "./accountStrategy.js";
import { Balance } from "./balance.js";
import { isLiteralType } from "./literalType.js";
import type { Operation } from "./operation.js";
import { StrategyFlow } from "./strategyFlow.js";
import { StrategyMemory } from "./strategyMemory.js";
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

export type ExecuteStrategyOptions = {
  /**
   * If `balances` is defined it is used to initialize context balances.
   */
  balances?: undefined | Balance[];

  /**
   * If `dryRun` is true, the execution will run in a "test" context,
   * not actually performing real operations.
   */
  dryRun?: undefined | boolean;

  /**
   * If `memory` is undefined it defaults to StrategyMemory given by AccountStrategyKey.
   */
  memory?: undefined | StrategyMemory["memory"];

  /**
   * If `timestamp` is undefined it resolves to "system" time.
   * If provided, it is used to simulate time.
   */
  timestamp?: undefined | Timestamp;

  /**
   * If `view` is undefined it defaults to StrategyFlow given by AccountStrategyKey.
   */
  view?: undefined | StrategyFlow["view"];
};

export type ExecuteStrategy = Operation<
  AccountStrategyKey & ExecuteStrategyOptions,
  StrategyExecution
>;

export type WriteStrategyExecution = Operation<
  AccountStrategyKey & Omit<StrategyExecution, "whenUpdated">,
  UpdateTime
>;

export type DeleteStrategyExecution = Operation<
  AccountStrategyKey,
  DeletionTime
>;
