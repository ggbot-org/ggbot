import {
  CopyStrategyFlow,
  createdNow,
  DeleteStrategyFlow,
  ErrorPermissionOnStrategyItem,
  ErrorStrategyItemNotFound,
  isStrategyFlow,
  ReadStrategyFlow,
  StrategyFlow,
  updatedNow,
  WriteStrategyFlow,
} from "@ggbot2/models";

import { DELETE, putObject, READ } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { readStrategyAccountId } from "./strategy.js";

export const copyStrategyFlow: CopyStrategyFlow["func"] = async ({
  accountId,
  source: strategyKey,
  target,
}) => {
  const strategyFlow = await readStrategyFlow(strategyKey);
  if (!strategyFlow)
    throw new ErrorStrategyItemNotFound({
      type: "StrategyFlow",
      ...strategyKey,
    });
  await writeStrategyFlow({
    accountId,
    view: strategyFlow.view,
    ...target,
  });
  return createdNow();
};

export const readStrategyFlow: ReadStrategyFlow["func"] = (arg) =>
  READ<ReadStrategyFlow["out"]>(isStrategyFlow, pathname.strategyFlow(arg));

export const writeStrategyFlow: WriteStrategyFlow["func"] = async ({
  accountId,
  view,
  ...strategyKey
}) => {
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionOnStrategyItem({
      type: "StrategyFlow",
      action: "write",
      accountId,
      ...strategyKey,
    });
  const whenUpdated = updatedNow();
  const data: StrategyFlow = {
    view,
    ...whenUpdated,
  };
  await putObject(pathname.strategyFlow(strategyKey), data);
  return whenUpdated;
};

export const deleteStrategyFlow: DeleteStrategyFlow["func"] = async ({
  accountId,
  ...strategyKey
}) => {
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionOnStrategyItem({
      type: "StrategyFlow",
      action: "delete",
      accountId,
      ...strategyKey,
    });
  return await DELETE(pathname.strategyFlow(strategyKey));
};
