import {
  AccountStrategyListItem,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  ListStrategies,
  ReadStrategy,
  ReadStrategyAccountId,
  RenameStrategy,
  Strategy,
  createdNow,
  deletedNow,
  isAccountKey,
  normalizeName,
  throwIfInvalidName,
  updatedNow,
} from "@ggbot2/models";
import { randomUUID } from "crypto";
import {
  deleteObject,
  getObject,
  listObjects,
  putObject,
} from "./_dataBucket.js";
import {
  strategyKeyToDirname,
  strategyPathname,
} from "./_dataBucketLocators.js";
import {
  readAccountStrategyList,
  writeAccountStrategyList,
} from "./accountStrategyList.js";
import {
  ErrorAccountItemNotFound,
  ErrorPermissionOnStrategyItem,
  ErrorStrategyItemNotFound,
} from "./errors.js";
import { deleteStrategyExecution } from "./strategyExecution.js";
import { deleteStrategyFlow } from "./strategyFlow.js";
import { deleteStrategyMemory } from "./strategyMemory.js";

/**
@throws {ErrorInvalidArg}
@throws {ErrorStrategyItemNotFound}
*/
export const copyStrategy: CopyStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  const strategy = await readStrategy(strategyKey);
  if (!strategy)
    throw new ErrorStrategyItemNotFound({ type: "Strategy", ...strategyKey });
  return await createStrategy({
    accountId,
    kind: strategyKey.strategyKind,
    name,
  });
};

/**
@throws {ErrorInvalidArg}
*/
export const createStrategy: CreateStrategy["func"] = async ({
  accountId,
  kind,
  name,
}) => {
  throwIfInvalidName(name);
  const strategyId = randomUUID();
  const strategyKind = kind;
  const strategyKey = { strategyId, strategyKind };
  const data: Strategy = {
    id: strategyId,
    kind,
    name,
    accountId,
    ...createdNow(),
  };
  const Key = strategyPathname(strategyKey);
  await putObject({ Key, data });
  const strategies = (await readAccountStrategyList({ accountId })) ?? [];
  const strategyListItem: AccountStrategyListItem = {
    name,
    schedulingStatus: "inactive",
    ...strategyKey,
  };
  await writeAccountStrategyList({
    accountId,
    strategies: strategies.concat(strategyListItem),
  });
  return data;
};

export const listStrategies: ListStrategies["func"] = async (strategyKey) => {
  const strategies = await listObjects({
    Prefix: strategyKeyToDirname(strategyKey),
  });
  // TODO destructure strategy paths
  console.log(strategies);
  return [];
};

export const readStrategy: ReadStrategy["func"] = async (strategyKey) =>
  await getObject<ReadStrategy["out"]>({
    Key: strategyPathname(strategyKey),
  });

/**
 @throws {ErrorStrategyItemNotFound}
*/
export const readStrategyAccountId: ReadStrategyAccountId["func"] = async (
  strategyKey
) => {
  const data = await readStrategy(strategyKey);
  if (!data)
    throw new ErrorStrategyItemNotFound({ type: "Strategy", ...strategyKey });
  if (!isAccountKey(data))
    throw new ErrorAccountItemNotFound({ type: "Account" });
  return data.accountId;
};

/**
@throws {ErrorInvalidArg}
 @throws {ErrorStrategyItemNotFound}
*/
export const renameStrategy: RenameStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  const strategy = await readStrategy(strategyKey);
  if (!strategy)
    throw new ErrorStrategyItemNotFound({ type: "Strategy", ...strategyKey });
  if (strategy.accountId === accountId) {
    const renamedStrategy = { ...strategy, name: normalizeName(name) };
    const Key = strategyPathname(strategyKey);
    await putObject({ Key, data: renamedStrategy });
  }
  const strategies = (await readAccountStrategyList({ accountId })) ?? [];
  await writeAccountStrategyList({
    accountId,
    strategies: strategies.map(({ strategyId, name: itemName, ...item }) => ({
      strategyId,
      name: strategyId === strategyKey.strategyId ? name : itemName,
      ...item,
    })),
  });
  return updatedNow();
};

/**
@throws {ErrorPermissionOnStrategyItem}
*/
export const deleteStrategy: DeleteStrategy["func"] = async (
  accountStrategyKey
) => {
  const { accountId, ...strategyKey } = accountStrategyKey;
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionOnStrategyItem({
      action: "delete",
      type: "Strategy",
      accountId,
      ...strategyKey,
    });
  const Key = strategyPathname(strategyKey);
  await deleteObject({ Key });
  await deleteStrategyExecution(accountStrategyKey);
  await deleteStrategyFlow(accountStrategyKey);
  await deleteStrategyMemory(accountStrategyKey);
  const strategies = (await readAccountStrategyList({ accountId })) ?? [];
  await writeAccountStrategyList({
    accountId,
    strategies: strategies.filter(
      ({ strategyId }) => strategyId !== strategyKey.strategyId
    ),
  });
  return deletedNow();
};
