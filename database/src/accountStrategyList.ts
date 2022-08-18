import {
  AccountKey,
  AccountStrategyList,
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { accountKeyToDirname } from "./accountKey.js";

export const accountStrategyListDirnamePrefix = () => "accountStrategies";

export const accountStrategyListDirname = (accountKey: AccountKey) =>
  `${accountStrategyListDirnamePrefix()}/${accountKeyToDirname(accountKey)}`;

export const accountStrategyListPathname = (accountKey: AccountKey) =>
  `${accountStrategyListDirname(accountKey)}/strategies.json`;

export const readAccountStrategyList: ReadAccountStrategyList["func"] = async (
  accountKey
) =>
  await getObject<ReadAccountStrategyList["out"]>({
    Key: accountStrategyListPathname(accountKey),
  });

export const writeAccountStrategyList: WriteAccountStrategyList["func"] =
  async ({ accountId, strategies }) => {
    const Key = accountStrategyListPathname({ accountId });
    await putObject({ Key, data: strategies });
    return updatedNow();
  };
