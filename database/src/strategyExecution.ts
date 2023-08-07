import {
  DeleteStrategyExecution,
  ReadStrategyExecution,
  StrategyExecution,
  updatedNow,
  WriteStrategyExecution,
} from "@ggbot2/models";

import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyExecution: ReadStrategyExecution["func"] = async (
  arg
) =>
  await getObject<ReadStrategyExecution["out"]>({
    Key: pathname.strategyExecution(arg),
  });

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
  const Key = pathname.strategyExecution({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyExecution: DeleteStrategyExecution["func"] = async (
  arg
) => await deleteObject({ Key: pathname.strategyExecution(arg) });
