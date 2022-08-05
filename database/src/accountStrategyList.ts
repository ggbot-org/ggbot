import { getObject, putObject } from "@ggbot2/aws";
import {
  AccountKey,
  AccountStrategyList,
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { accountKeyToDirname } from "./accountKey.js";

export const accountStrategyListDirnamePrefix = () => "accountStrategies";

export const accountStrategyListDirname = (accountKey: AccountKey) =>
  `${accountStrategyListDirnamePrefix()}/${accountKeyToDirname(accountKey)}`;

export const accountStrategyListPathname = (accountKey: AccountKey) =>
  `${accountStrategyListDirname(accountKey)}/strategies.json`;

export const readAccountStrategyList: ReadAccountStrategyList["func"] = async (
  accountKey
) => {
  const Key = accountStrategyListPathname(accountKey);
  const data = await getObject({ Key });
  if (!data) return;
  return data as AccountStrategyList;
};

export const writeAccountStrategyList: WriteAccountStrategyList["func"] =
  async ({ accountId, strategies }) => {
    const Key = accountStrategyListPathname({ accountId });
    await putObject({ Key, data: strategies });
    return updatedNow();
  };
