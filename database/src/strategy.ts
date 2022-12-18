import {
  Account,
  CacheMap,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  ListStrategyKeys,
  ReadStrategy,
  ReadStrategyAccountId,
  RenameStrategy,
  StrategyKey,
  isAccountKey,
  newAccountStrategy,
  newStrategy,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import {
  deleteObject,
  getObject,
  listObjects,
  putObject,
} from "./_dataBucket.js";
import {
  dirnameDelimiter,
  locatorToItemKey,
  itemKeyToDirname,
  pathname,
} from "./locators.js";
import {
  insertAccountStrategiesItem,
  updateAccountStrategiesItem,
  deleteAccountStrategiesItem,
} from "./accountStrategies.js";
import {
  ErrorAccountItemNotFound,
  ErrorPermissionOnStrategyItem,
  ErrorStrategyItemNotFound,
} from "./errors.js";
import { deleteStrategyExecution } from "./strategyExecution.js";
import { copyStrategyFlow, deleteStrategyFlow } from "./strategyFlow.js";
import { deleteStrategyMemory } from "./strategyMemory.js";

const strategyAccountIdCache = new CacheMap<Account["id"]>();

/**
@throws {ErrorInvalidArg}
@throws {ErrorStrategyItemNotFound} */
export const copyStrategy: CopyStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);

  const strategy = await createStrategy({
    accountId,
    kind: strategyKey.strategyKind,
    name,
  });

  await copyStrategyFlow({
    accountId,
    source: strategyKey,
    target: {
      strategyId: strategy.id,
      strategyKind: strategy.kind,
    },
  });

  // TODO copy scheduling and put it as inactive
  // however schedulings form need to show inanctive scheduling parameters

  return strategy;
};

/** @throws {ErrorInvalidArg} */
export const createStrategy: CreateStrategy["func"] = async ({
  accountId,
  kind,
  name,
}) => {
  throwIfInvalidName(name);
  const strategy = newStrategy({
    kind,
    name,
    accountId,
  });
  const strategyKey = { strategyId: strategy.id, strategyKind: kind };
  const Key = pathname.strategy(strategyKey);
  await putObject({ Key, data: strategy });
  const accountStrategy = newAccountStrategy({ name, ...strategyKey });
  insertAccountStrategiesItem({ accountId, item: accountStrategy });
  return strategy;
};

export const listStrategyKeys: ListStrategyKeys["func"] = async (
  strategyKey
) => {
  const Prefix = itemKeyToDirname.strategy(strategyKey) + dirnameDelimiter;
  const results = await listObjects({ Prefix });
  if (!Array.isArray(results.Contents)) return Promise.resolve([]);
  return (
    results.Contents.reduce<StrategyKey[]>((list, { Key }) => {
      if (typeof Key !== "string") return list;
      const itemKey = locatorToItemKey.strategy(Key);
      return isAccountKey(itemKey) ? list.concat(itemKey) : list;
    }, []) ?? []
  );
};

export const readStrategy: ReadStrategy["func"] = async (strategyKey) =>
  await getObject<ReadStrategy["out"]>({
    Key: pathname.strategy(strategyKey),
  });

/** Get `accountId` of strategy.
@throws {ErrorStrategyItemNotFound} */
export const readStrategyAccountId: ReadStrategyAccountId["func"] = async (
  strategyKey
) => {
  const { strategyId } = strategyKey;
  const cachedData = strategyAccountIdCache.get(strategyId);
  if (cachedData) return cachedData;
  const data = await readStrategy(strategyKey);
  if (!data)
    throw new ErrorStrategyItemNotFound({ type: "Strategy", ...strategyKey });
  if (!isAccountKey(data))
    throw new ErrorAccountItemNotFound({
      type: "Account",
      accountId: undefined,
    });
  const { accountId } = data;
  strategyAccountIdCache.set(strategyId, accountId);
  return accountId;
};

/** Rename strategy.
@throws {ErrorInvalidArg}
@throws {ErrorStrategyItemNotFound} */
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
    const Key = pathname.strategy(strategyKey);
    await putObject({ Key, data: renamedStrategy });
  }
  return await updateAccountStrategiesItem({
    accountId,
    ...strategyKey,
    changes: { name },
  });
};

/** Delete strategy.
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
  const Key = pathname.strategy(strategyKey);
  await deleteObject({ Key });
  await deleteStrategyExecution(accountStrategyKey);
  await deleteStrategyFlow(accountStrategyKey);
  await deleteStrategyMemory(accountStrategyKey);
  return await deleteAccountStrategiesItem(accountStrategyKey);
};
