import {
  DeleteStrategyExecution,
  ReadStrategyExecution,
  StrategyExecution,
  WriteStrategyExecution,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyExecutionPathname } from "./_dataBucketLocators.js";

export const readStrategyExecution: ReadStrategyExecution["func"] = async (_) =>
  await getObject<ReadStrategyExecution["out"]>({
    Key: strategyExecutionPathname(_),
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
  const Key = strategyExecutionPathname({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyExecution: DeleteStrategyExecution["func"] = async (
  _
) => await deleteObject({ Key: strategyExecutionPathname(_) });
