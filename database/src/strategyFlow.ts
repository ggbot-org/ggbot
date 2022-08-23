import {
  CopyStrategyFlow,
  DeleteStrategyFlow,
  ReadStrategyFlow,
  StrategyFlow,
  WriteStrategyFlow,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyFlowPathname } from "./_dataBucketLocators.js";
import {
  ErrorPermissionDeniedCannotDeleteStrategyFlow,
  ErrorPermissionDeniedCannotWriteStrategyFlow,
  ErrorStrategyFlowNotFound,
} from "./errors.js";
import { readStrategyAccountId } from "./strategy.js";

export const copyStrategyFlow: CopyStrategyFlow["func"] = async ({
  accountId,
  source: strategyKey,
  target,
}) => {
  const strategyFlow = await readStrategyFlow(strategyKey);
  if (!strategyFlow) throw new ErrorStrategyFlowNotFound(strategyKey);
  return await writeStrategyFlow({
    accountId,
    view: strategyFlow.view,
    ...target,
  });
};

export const readStrategyFlow: ReadStrategyFlow["func"] = async (strategyKey) =>
  await getObject<ReadStrategyFlow["out"]>({
    Key: strategyFlowPathname(strategyKey),
  });

export const writeStrategyFlow: WriteStrategyFlow["func"] = async ({
  accountId,
  view,
  ...strategyKey
}) => {
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionDeniedCannotWriteStrategyFlow({
      accountId,
      strategyKey,
    });
  const whenUpdated = updatedNow();
  const data: StrategyFlow = {
    view,
    ...whenUpdated,
  };
  const Key = strategyFlowPathname(strategyKey);
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyFlow: DeleteStrategyFlow["func"] = async ({
  accountId,
  ...strategyKey
}) => {
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionDeniedCannotDeleteStrategyFlow({
      accountId,
      strategyKey,
    });
  const Key = strategyFlowPathname(strategyKey);
  return await deleteObject({ Key });
};
