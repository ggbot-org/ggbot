import {
  AppendStrategyDailyBalanceChanges,
  isBalanceChangeEvents,
  ReadStrategyDailyBalanceChanges,
} from "@ggbot2/models";

import { READ, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readStrategyDailyBalanceChanges: ReadStrategyDailyBalanceChanges["func"] =
  (arg) =>
    READ<ReadStrategyDailyBalanceChanges["out"]>(
      isBalanceChangeEvents,
      pathname.strategyDailyBalanceChanges(arg)
    );

export const appendStrategyDailyBalanceChanges: AppendStrategyDailyBalanceChanges["func"] =
  async ({ items, ...key }) => {
    const currentItems = await readStrategyDailyBalanceChanges(key);
    const data = currentItems ? [...currentItems, ...items] : items;
    return await UPDATE(pathname.strategyDailyBalanceChanges(key), data);
  };
