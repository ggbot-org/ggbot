import {
  ReadStrategyDailyOrders,
  AppendStrategyDailyOrders,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyDailyOrders: ReadStrategyDailyOrders["func"] = async (
  arg
) =>
  await getObject<ReadStrategyDailyOrders["out"]>({
    Key: pathname.strategyDailyOrders(arg),
  });

export const appendStrategyDailyOrders: AppendStrategyDailyOrders["func"] =
  async ({ items, ...key }) => {
    const currentItems = await readStrategyDailyOrders(key);
    const Key = pathname.strategyDailyOrders(key);
    const data = currentItems ? [...currentItems, ...items] : items;
    await putObject({ Key, data });
    return updatedNow();
  };
