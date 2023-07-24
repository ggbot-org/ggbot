import { isOrders, Orders } from "@ggbot2/models";
import {
  getTime,
  now,
  TimeInterval,
  timeIntervalToDay,
  truncateTime,
} from "@ggbot2/time";
import { FC, useContext, useEffect } from "react";

import { ProfitSummary } from "../components/ProfitSummary.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";

export const StrategyProfits: FC = () => {
  const { strategyKey } = useContext(StrategyContext);

  const numDays = 30;

  const end = truncateTime(now()).to.day();
  const start = getTime(end).minus(numDays).days();
  const timeInterval: TimeInterval = { start, end };

  const READ = useApi.ReadStrategyOrders();

  const orders: Orders = isOrders(READ.data) ? READ.data : [];

  const dayInterval = timeIntervalToDay(timeInterval);

  useEffect(() => {
    if (!strategyKey) return;
    if (READ.canRun) READ.request({ ...strategyKey, ...dayInterval });
  }, [READ, dayInterval, strategyKey]);

  return <ProfitSummary timeInterval={timeInterval} orders={orders} />;
};
