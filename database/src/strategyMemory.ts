import {
  DeleteStrategyMemory,
  ReadStrategyMemory,
  StrategyMemory,
  WriteStrategyMemory,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyMemoryPathname } from "./_dataBucketLocators.js";

export const readStrategyMemory: ReadStrategyMemory["func"] = async (_) =>
  await getObject<ReadStrategyMemory["out"]>({
    Key: strategyMemoryPathname(_),
  });

export const writeStrategyMemory: WriteStrategyMemory["func"] = async ({
  accountId,
  strategyKind,
  strategyId,
  ...rest
}) => {
  const whenUpdated = updatedNow();
  const data: StrategyMemory = {
    ...rest,
    ...whenUpdated,
  };
  const Key = strategyMemoryPathname({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyMemory: DeleteStrategyMemory["func"] = async (_) =>
  await deleteObject({ Key: strategyMemoryPathname(_) });
