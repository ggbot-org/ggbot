import { getObject, putObject } from "@ggbot2/aws";
import {
  AccountKey,
  ErrorItemNotValid,
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  isAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { accountKeyToDirname } from "./account.js";

export const accountStrategyListDirnamePrefix = () => "accountStrategies";

export const accountStrategyListDirname = (accountKey: AccountKey) =>
  `${accountStrategyListDirnamePrefix()}/${accountKeyToDirname(accountKey)}`;

export const accountStrategyListPathname = (accountKey: AccountKey) =>
  `${accountStrategyListDirname(accountKey)}/strategies.json`;

export const readAccountStrategyList: ReadAccountStrategyList["func"] = async ({
  accountId,
}) => {
  const Key = accountStrategyListPathname({ accountId });
  const data = await getObject({ Key });
  if (!data) return [];
  if (!isAccountStrategyList(data)) throw new ErrorItemNotValid();
  return data;
};

export const writeAccountStrategyList: WriteAccountStrategyList["func"] =
  async ({ accountId, strategies }) => {
    const Key = accountStrategyListPathname({ accountId });
    await putObject({ Key, data: strategies });
    return updatedNow();
  };
