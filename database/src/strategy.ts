import { deleteObject, getObject, putObject } from "@ggbot2/aws";
import {
  CreateStrategy,
  DeleteStrategy,
  ReadStrategy,
  Strategy,
  StrategyKey,
  createdNow,
  deletedNow,
} from "@ggbot2/models";
import { v4 as uuidv4 } from "uuid";

export const strategyDirnamePrefix = () => "strategy";

export const strategyDirname = (strategyKey: StrategyKey) =>
  `${strategyDirnamePrefix()}/${strategyKeyToDirname(strategyKey)}`;

export const strategyKeyToDirname = ({
  strategyId,
  strategyKind,
}: StrategyKey) => `strategyKind=${strategyKind}/strategyId=${strategyId}`;

export const strategyPathname = (strategyKey: StrategyKey) =>
  `${strategyDirname(strategyKey)}/strategy.json`;

export const createStrategy: CreateStrategy["func"] = async ({
  accountId,
  kind,
  name,
}) => {
  const strategyId = uuidv4();
  const data: Strategy = {
    id: strategyId,
    kind,
    name,
    accountId,
    ...createdNow(),
  };
  const Key = strategyPathname({ strategyId, strategyKind: kind });
  await putObject({ Key, data });
  return data;
};

export const readStrategy: ReadStrategy["func"] = async (strategyKey) => {
  const Key = strategyPathname(strategyKey);
  const data = await getObject({ Key });
  if (!data) return;
  return data as Strategy;
};

export const deleteStrategy: DeleteStrategy["func"] = async (accountKey) => {
  const Key = strategyPathname(accountKey);
  await deleteObject({ Key });
  return deletedNow();
};
