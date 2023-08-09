import {
  DeleteStrategyExecution,
  isStrategyExecution,
  ReadStrategyExecution,
  StrategyExecution,
  updatedNow,
  WriteStrategyExecution,
} from "@ggbot2/models";

import { DELETE, READ, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyExecution: ReadStrategyExecution["func"] = (arg) =>
  READ<ReadStrategyExecution["out"]>(
    isStrategyExecution,
    pathname.strategyExecution(arg)
  );

export const writeStrategyExecution: WriteStrategyExecution["func"] = async ({
  accountId,
  strategyKind,
  strategyId,
  ...rest
}) => {
  const whenUpdated = updatedNow();
  const data: StrategyExecution = {
    ...rest,
    ...whenUpdated,
  };
  await UPDATE(
    pathname.strategyExecution({
      accountId,
      strategyKind,
      strategyId,
    }),
    data
  );
  return whenUpdated;
};

export const deleteStrategyExecution: DeleteStrategyExecution["func"] = (arg) =>
  DELETE(pathname.strategyExecution(arg));
