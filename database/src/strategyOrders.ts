import type { ReadStrategyOrders } from "@ggbot2/models";
import { dateToDay, dayToDate, getDate } from "@ggbot2/time";
import { readStrategyDailyOrders } from "./strategyDailyOrders.js";

export const readStrategyOrders: ReadStrategyOrders["func"] = async ({
  start,
  end,
  ...key
}) => {
  const result: ReadStrategyOrders["out"] = [];
  let date = dayToDate(start);
  while (date <= dayToDate(end)) {
    const day = dateToDay(date);
    const orders = (await readStrategyDailyOrders({ day, ...key })) ?? [];
    for (const order of orders) result.push(order);
    date = getDate(date).plus(1).days();
  }
  return result;
};
