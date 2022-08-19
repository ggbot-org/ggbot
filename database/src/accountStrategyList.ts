import {
  AccountKey,
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { accountStrategyListDirname } from "./_dirnames.js";

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
