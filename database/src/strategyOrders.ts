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
    const data = (await readStrategyDailyOrders({ day, ...key })) ?? [];
    result.push({ day, data });
    date = getDate(date).plus(1).days();
  }
  return result;
};
