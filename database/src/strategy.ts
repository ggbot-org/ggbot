import { deleteObject, getObject, putObject } from "@ggbot2/aws";
import {
  AccountStrategyListItem,
  CopyStrategy,
  CreateStrategy,
  DeleteStrategy,
  ReadStrategy,
  ReadStrategyAccountId,
  RenameStrategy,
  Strategy,
  StrategyKey,
  createdNow,
  deletedNow,
  isAccountKey,
  isStrategyName,
  normalizeName,
  throwIfInvalidName,
  updatedNow,
} from "@ggbot2/models";
import { v4 as uuidv4 } from "uuid";
import {
  readAccountStrategyList,
  writeAccountStrategyList,
} from "./accountStrategyList.js";
import {
  ErrorInvalidStrategyName,
  ErrorMissingAccountId,
  ErrorPermissionDeniedCannotDeleteStrategy,
  ErrorStrategyNotFound,
} from "./errors.js";
import { strategyKeyToDirname } from "./strategyKey.js";

export const strategyDirnamePrefix = () => "strategy";

export const strategyDirname = (strategyKey: StrategyKey) =>
  `${strategyDirnamePrefix()}/${strategyKeyToDirname(strategyKey)}`;

export const strategyPathname = (strategyKey: StrategyKey) =>
  `${strategyDirname(strategyKey)}/strategy.json`;

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

export const readStrategy: ReadStrategy["func"] = async (strategyKey) => {
  const Key = strategyPathname(strategyKey);
  const data = await getObject({ Key });
  if (!data) return;
  return data as Strategy;
};

export const readStrategyAccountId: ReadStrategyAccountId["func"] = async (
  strategyKey
) => {
  const Key = strategyPathname(strategyKey);
  const data = await getObject({ Key });
  if (!data) throw new ErrorStrategyNotFound(strategyKey);
  if (!isAccountKey(data)) throw new ErrorMissingAccountId();
  return data.accountId;
};

export const renameStrategy: RenameStrategy["func"] = async ({
  accountId,
  name,
  ...strategyKey
}) => {
  throwIfInvalidName(name);
  if (!isStrategyName(name)) throw new ErrorInvalidStrategyName(name);
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
      strategyId: strategyKey.strategyId,
      name: strategyId === strategyKey.strategyId ? name : itemName,
      ...item,
    })),
  });
  return updatedNow();
};

export const deleteStrategy: DeleteStrategy["func"] = async ({
  accountId,
  ...strategyKey
}) => {
  const ownerId = await readStrategyAccountId(strategyKey);
  if (accountId !== ownerId)
    throw new ErrorPermissionDeniedCannotDeleteStrategy({
      accountId,
      strategyKey,
    });
  const Key = strategyPathname(strategyKey);
  await deleteObject({ Key });
  const strategies = (await readAccountStrategyList({ accountId })) ?? [];
  await writeAccountStrategyList({
    accountId,
    strategies: strategies.filter(
      ({ strategyId }) => strategyId !== strategyKey.strategyId
    ),
  });
  return deletedNow();
};
