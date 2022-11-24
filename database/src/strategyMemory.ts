import {
  DeleteStrategyMemory,
  ReadStrategyMemory,
  StrategyMemory,
  WriteStrategyMemory,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyMemory: ReadStrategyMemory["func"] = async (arg) =>
  await getObject<ReadStrategyMemory["out"]>({
    Key: pathname.strategyMemory(arg),
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
  const Key = pathname.strategyMemory({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyMemory: DeleteStrategyMemory["func"] = async (arg) =>
  await deleteObject({ Key: pathname.strategyMemory(arg) });
