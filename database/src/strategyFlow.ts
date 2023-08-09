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

import { DELETE, READ, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { readStrategyAccountId } from "./strategy.js";

export const copyStrategyFlow: CopyStrategyFlow = async ({
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

export const readStrategyFlow: ReadStrategyFlow = (arg) =>
  READ<ReadStrategyFlow>(isStrategyFlow, pathname.strategyFlow(arg));

export const writeStrategyFlow: WriteStrategyFlow = async ({
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
  const data: StrategyFlow = {
    view,
    ...updatedNow(),
  };
  return await UPDATE(pathname.strategyFlow(strategyKey), data);
};

export const deleteStrategyFlow: DeleteStrategyFlow = async ({
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
