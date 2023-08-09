import {
  AppendAccountDailyOrders,
  isAccountDailyOrders,
  ReadAccountDailyOrders,
} from "@ggbot2/models";

import { READ, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readAccountDailyOrders: ReadAccountDailyOrders["func"] = (arg) =>
  READ<ReadAccountDailyOrders["out"]>(
    isAccountDailyOrders,
    pathname.accountDailyOrders(arg)
  );

export const appendAccountDailyOrders: AppendAccountDailyOrders["func"] =
  async ({ items, ...key }) => {
    const currentItems = await readAccountDailyOrders(key);
    const data = currentItems ? [...currentItems, ...items] : items;
    return await UPDATE(pathname.accountDailyOrders(key), data);
  };
