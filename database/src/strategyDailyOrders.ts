import {
  AppendStrategyDailyOrders,
  isStrategyDailyOrders,
  ReadStrategyDailyOrders,
} from "@ggbot2/models";

import { READ_ARRAY, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyDailyOrders: ReadStrategyDailyOrders = (arg) =>
  READ_ARRAY<ReadStrategyDailyOrders>(
    isStrategyDailyOrders,
    pathname.strategyDailyOrders(arg)
  );

export const appendStrategyDailyOrders: AppendStrategyDailyOrders = async ({
  items,
  ...key
}) => {
  const currentItems = await readStrategyDailyOrders(key);
  const data = currentItems ? [...currentItems, ...items] : items;
  return await UPDATE(pathname.strategyDailyOrders(key), data);
};
