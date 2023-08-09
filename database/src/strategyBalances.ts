import { ReadStrategyBalances } from "@ggbot2/models";
import { dateToDay, dayToDate, getDate } from "@ggbot2/time";

import { readStrategyDailyBalanceChanges } from "./strategyDailyBalanceChanges.js";

export const readStrategyBalances: ReadStrategyBalances = async ({
  start,
  end,
  ...key
}) => {
  const result: Awaited<ReturnType<ReadStrategyBalances>> = [];
  let date = dayToDate(start);
  while (date <= dayToDate(end)) {
    const day = dateToDay(date);
    const data = (await readStrategyDailyBalanceChanges({ day, ...key })) ?? [];
    result.push({ day, data });
    date = getDate(date).plus(1).days();
  }
  return result;
};
