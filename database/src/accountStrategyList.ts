import {
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { accountStrategyListPathname } from "./_dataBucketLocators.js";

export const readAccountStrategyList: ReadAccountStrategyList["func"] = async (
  key
) =>
  await getObject<ReadAccountStrategyList["out"]>({
    Key: accountStrategyListPathname(key),
  });

export const writeAccountStrategyList: WriteAccountStrategyList["func"] =
  async ({ accountId, strategies }) => {
    const Key = accountStrategyListPathname({ accountId });
    await putObject({ Key, data: strategies });
    return updatedNow();
  };
