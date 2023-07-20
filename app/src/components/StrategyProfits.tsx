import { isOrders, Orders } from "@ggbot2/models";
import {
  getTime,
  now,
  TimeInterval,
  timeIntervalToDay,
  truncateTime,
} from "@ggbot2/time";
import { FC, useContext, useEffect } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { ProfitSummary } from "./ProfitSummary.js";

export const StrategyProfits: FC = () => {
  const { strategyKey } = useContext(StrategyContext);

  const numDays = 30;

  const end = truncateTime(now()).to.day();
  const start = getTime(end).minus(numDays).days();
  const timeInterval: TimeInterval = { start, end };

  const { request: READ, data: orders } = useApi.ReadStrategyOrders();

  const orderHistory: Orders = isOrders(orders) ? orders : [];

  const dayInterval = timeIntervalToDay(timeInterval);

  useEffect(() => {
    if (!strategyKey) return;
    const controller = READ({ ...strategyKey, ...dayInterval });
    return () => controller.abort();
  }, [dayInterval, READ, strategyKey]);

  return (
    <ProfitSummary timeInterval={timeInterval} orderHistory={orderHistory} />
  );
};
