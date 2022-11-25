import {
  AccountStrategy,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  ListStrategyKeys,
  ReadStrategy,
  ReadStrategyAccountId,
  RenameStrategy,
  Strategy,
  StrategyKey,
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
  dirnameDelimiter,
  locatorToItemKey,
  itemKeyToDirname,
  pathname,
} from "./locators.js";
import {
  readAccountStrategies,
  writeAccountStrategies,
} from "./accountStrategies.js";
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
@throws {ErrorStrategyItemNotFound} */
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

/** @throws {ErrorInvalidArg} */
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
  const Key = pathname.strategy(strategyKey);
  await putObject({ Key, data });
  const strategies = (await readAccountStrategies({ accountId })) ?? [];
  const strategyListItem: AccountStrategy = {
    name,
    schedulingStatus: "inactive",
    ...strategyKey,
  };
  await writeAccountStrategies({
    accountId,
    strategies: strategies.concat(strategyListItem),
  });
  return data;
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
    const Key = pathname.strategy(strategyKey);
    await putObject({ Key, data: renamedStrategy });
  }
  const strategies = (await readAccountStrategies({ accountId })) ?? [];
  await writeAccountStrategies({
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
  const Key = pathname.strategy(strategyKey);
  await deleteObject({ Key });
  await deleteStrategyExecution(accountStrategyKey);
  await deleteStrategyFlow(accountStrategyKey);
  await deleteStrategyMemory(accountStrategyKey);
  const strategies = (await readAccountStrategies({ accountId })) ?? [];
  await writeAccountStrategies({
    accountId,
    strategies: strategies.filter(
      ({ strategyId }) => strategyId !== strategyKey.strategyId
    ),
  });
  return deletedNow();
};
