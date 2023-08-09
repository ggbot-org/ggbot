import {
  Account,
  CacheMap,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  ErrorAccountItemNotFound,
  ErrorPermissionOnStrategyItem,
  ErrorStrategyItemNotFound,
  isAccountKey,
  isStrategy,
  ListStrategyKeys,
  newAccountStrategy,
  newStrategy,
  normalizeName,
  ReadStrategy,
  ReadStrategyAccountId,
  RenameStrategy,
  StrategyKey,
  throwIfInvalidName,
} from "@ggbot2/models";

import { DELETE, LIST, putObject, READ } from "./_dataBucket.js";
import {
  deleteAccountStrategiesItem,
  insertAccountStrategiesItem,
  renameAccountStrategiesItem,
} from "./accountStrategies.js";
import {
  dirnameDelimiter,
  itemKeyToDirname,
  locatorToItemKey,
  pathname,
} from "./locators.js";
import { deleteStrategyExecution } from "./strategyExecution.js";
import { copyStrategyFlow, deleteStrategyFlow } from "./strategyFlow.js";
import { deleteStrategyMemory } from "./strategyMemory.js";

const strategyAccountIdCache = new CacheMap<Account["id"]>();

/**
 * Atomic operation to create a strategy.
 *
 * @internal
 */
const _createStrategy: CreateStrategy["func"] = async ({
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
  await putObject(pathname.strategy(strategyKey), strategy);
  const accountStrategy = newAccountStrategy({ name, ...strategyKey });
  await insertAccountStrategiesItem({ accountId, item: accountStrategy });
  return strategy;
};

export const copyStrategy: CopyStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  const strategy = await _createStrategy({
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

export const createStrategy: CreateStrategy["func"] = async ({
  accountId,
  kind,
  name,
}) => {
  const strategy = await _createStrategy({ accountId, kind, name });
  // Create strategy first,

  // TODO try to handle empty strategy client side, then delete this commented code.
  // also, the comment above
  // then create an empty flow.
  // const strategyFlowKey = pathname.strategyFlow({
  //   strategyId: strategy.id,
  //   strategyKind: strategy.kind,
  // });
  // const whenUpdated = updatedNow();
  // const flow: StrategyFlow = {
  //   view: { nodes: [], edges: [] },
  //   ...whenUpdated,
  // };
  // await putObject({ Key: strategyFlowKey, data: flow });
  return strategy;
};

export const listStrategyKeys: ListStrategyKeys["func"] = async (
  strategyKey
) => {
  const Prefix = itemKeyToDirname.strategy(strategyKey) + dirnameDelimiter;
  const results = await LIST({ Prefix });
  if (!Array.isArray(results.Contents)) return Promise.resolve([]);
  return (
    results.Contents.reduce<StrategyKey[]>((list, { Key }) => {
      if (typeof Key !== "string") return list;
      const itemKey = locatorToItemKey.strategy(Key);
      return isAccountKey(itemKey) ? list.concat(itemKey) : list;
    }, []) ?? []
  );
};

export const readStrategy: ReadStrategy["func"] = (arg) =>
  READ<ReadStrategy["out"]>(isStrategy, pathname.strategy(arg));

/** Get `accountId` of strategy. */
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

export const renameStrategy: RenameStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  const strategy = await readStrategy(strategyKey);
  if (!strategy)
    throw new ErrorStrategyItemNotFound({ type: "Strategy", ...strategyKey });
  const normalizedName = normalizeName(name);
  const { strategyId } = strategyKey;
  if (strategy.accountId === accountId) {
    const renamedStrategy = { ...strategy, name: normalizedName };
    await putObject(pathname.strategy(strategyKey), renamedStrategy);
  }
  return await renameAccountStrategiesItem({
    accountId,
    strategyId,
    name: normalizedName,
  });
};

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
  await DELETE(pathname.strategy(strategyKey));
  await deleteStrategyExecution(accountStrategyKey);
  await deleteStrategyFlow(accountStrategyKey);
  await deleteStrategyMemory(accountStrategyKey);
  return await deleteAccountStrategiesItem(accountStrategyKey);
};
