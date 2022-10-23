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
  StrategyKey,
  createdNow,
  deletedNow,
  isAccountKey,
  normalizeName,
  throwIfInvalidName,
  updatedNow,
} from "@ggbot2/models";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getObject,
  listObjects,
  putObject,
} from "./_dataBucket.js";
import { strategyKeyToDirname } from "./_dataBucketLocators.js";
import {
  readAccountStrategyList,
  writeAccountStrategyList,
} from "./accountStrategyList.js";
import {
  ErrorMissingAccountId,
  ErrorPermissionDeniedCannotDeleteStrategy,
  ErrorStrategyNotFound,
} from "./errors.js";
import { deleteStrategyExecution } from "./strategyExecution.js";
import { deleteStrategyFlow } from "./strategyFlow.js";
import { deleteStrategyMemory } from "./strategyMemory.js";

export const strategyDirnamePrefix = () => "strategy";

export const strategyDirname = (strategyKey: StrategyKey) =>
  `${strategyDirnamePrefix()}/${strategyKeyToDirname(strategyKey)}`;

export const strategyPathname = (strategyKey: StrategyKey) =>
  `${strategyDirname(strategyKey)}/strategy.json`;

/**
@throws {ErrorInvalidName}
@throws {ErrorNameToLong}
*/
export const copyStrategy: CopyStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  const strategy = await readStrategy(strategyKey);
  if (!strategy) throw new ErrorStrategyNotFound(strategyKey);
  return await createStrategy({
    accountId,
    kind: strategyKey.strategyKind,
    name,
  });
};

/**
@throws {ErrorInvalidName}
@throws {ErrorNameToLong}
*/
export const createStrategy: CreateStrategy["func"] = async ({
  accountId,
  kind,
  name,
}) => {
  throwIfInvalidName(name);
  const strategyId = uuidv4();
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

export const readStrategyAccountId: ReadStrategyAccountId["func"] = async (
  strategyKey
) => {
  const data = await readStrategy(strategyKey);
  if (!data) throw new ErrorStrategyNotFound(strategyKey);
  if (!isAccountKey(data)) throw new ErrorMissingAccountId();
  return data.accountId;
};

/**
@throws {ErrorInvalidName}
@throws {ErrorNameToLong}
*/
export const renameStrategy: RenameStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  const strategy = await readStrategy(strategyKey);
  if (!strategy) throw new ErrorStrategyNotFound(strategyKey);
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
 * @throws {ErrorPermissionDeniedCannotDeleteStrategy}
 */
export const deleteStrategy: DeleteStrategy["func"] = async (
  accountStrategyKey
) => {
  const { accountId, ...strategyKey } = accountStrategyKey;
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionDeniedCannotDeleteStrategy({
      accountId,
      strategyKey,
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
