import {
  AppendStrategyDailyBalanceChanges,
  ReadStrategyDailyBalanceChanges,
  updatedNow,
} from "@ggbot2/models";

import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyDailyBalanceChanges: ReadStrategyDailyBalanceChanges["func"] =
  async (arg) =>
    await getObject<ReadStrategyDailyBalanceChanges["out"]>({
      Key: pathname.strategyDailyBalanceChanges(arg),
    });

export const appendStrategyDailyBalanceChanges: AppendStrategyDailyBalanceChanges["func"] =
  async ({ items, ...key }) => {
    const currentItems = await readStrategyDailyBalanceChanges(key);
    const Key = pathname.strategyDailyBalanceChanges(key);
    const data = currentItems ? [...currentItems, ...items] : items;
    await putObject({ Key, data });
    return updatedNow();
  };
