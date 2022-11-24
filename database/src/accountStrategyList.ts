import {
  ReadAccountStrategyList,
  WriteAccountStrategyList,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readAccountStrategyList: ReadAccountStrategyList["func"] = async (
  key
) =>
  await getObject<ReadAccountStrategyList["out"]>({
    Key: pathname.accountStrategyList(key),
  });

export const writeAccountStrategyList: WriteAccountStrategyList["func"] =
  async ({ accountId, strategies }) => {
    const Key = pathname.accountStrategyList({ accountId });
    await putObject({ Key, data: strategies });
    return updatedNow();
  };
