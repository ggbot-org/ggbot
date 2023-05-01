import {
  CopyStrategyFlow,
  DeleteStrategyFlow,
  ReadStrategyFlow,
  StrategyFlow,
  WriteStrategyFlow,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import {
  ErrorPermissionOnStrategyItem,
  ErrorStrategyItemNotFound,
} from "./errors.js";
import { readStrategyAccountId } from "./strategy.js";

/**
 * Copy strategy flow.
 *
 * @throws {@link ErrorStrategyItemNotFound}
 */
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
  return await writeStrategyFlow({
    accountId,
    view: strategyFlow.view,
    ...target,
  });
};

export const readStrategyFlow: ReadStrategyFlow["func"] = async (arg) =>
  await getObject<ReadStrategyFlow["out"]>({
    Key: pathname.strategyFlow(arg),
  });

/**
 * Write strategy flow.
 *
 * @throws {@link ErrorPermissionOnStrategyItem}
 */
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
  const Key = pathname.strategyFlow(strategyKey);
  await putObject({ Key, data });
  return whenUpdated;
};

/**
 * Delete strategy flow.
 *
 * @throws {@link ErrorPermissionOnStrategyItem}
 */
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
  const Key = pathname.strategyFlow(strategyKey);
  return await deleteObject({ Key });
};
