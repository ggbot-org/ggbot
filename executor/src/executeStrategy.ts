import {
  AccountStrategyKey,
  Operation,
  StrategyExecution,
} from "@ggbot2/models";

export type ExecuteStrategy = Operation<
  AccountStrategyKey,
  Pick<StrategyExecution, "status" | "whenUpdated">
>;
