import {
  ReadAccountDailyOrders,
  AppendAccountDailyOrders,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readAccountDailyOrders: ReadAccountDailyOrders["func"] = async (
  arg
) =>
  await getObject<ReadAccountDailyOrders["out"]>({
    Key: pathname.accountDailyOrders(arg),
  });

export const appendAccountDailyOrders: AppendAccountDailyOrders["func"] =
  async ({ items, ...key }) => {
    const currentItems = await readAccountDailyOrders(key);
    const Key = pathname.accountDailyOrders(key);
    const data = currentItems ? [...currentItems, ...items] : items;
    await putObject({ Key, data });
    return updatedNow();
  };
