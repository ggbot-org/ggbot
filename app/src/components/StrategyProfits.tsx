import { Orders, isOrders } from "@ggbot2/models";
import {
  TimeInterval,
  truncateTime,
  now,
  getTime,
  timeIntervalToDay,
} from "@ggbot2/time";
import { FC, useEffect } from "react";
import { ProfitSummary } from "_components/ProfitSummary";
import { useApi } from "_hooks/useApi";
import { StrategyKey } from "_routing/types";

type Props = {
  strategyKey: StrategyKey;
};

export const StrategyProfits: FC<Props> = ({ strategyKey }) => {
  const { strategyKind } = strategyKey;
  const numDays = 30;

  const end = truncateTime(now()).to.day();
  const start = getTime(end).minus(numDays).days();
  const timeInterval: TimeInterval = { start, end };

  const [READ_ORDERS, { data: orders }] = useApi.ReadStrategyOrders();

  const orderHistory: Orders = isOrders(orders) ? orders : [];

  const dayInterval = timeIntervalToDay(timeInterval);

  useEffect(() => {
    const controller = READ_ORDERS({ ...strategyKey, ...dayInterval });
    return () => controller.abort();
  }, [dayInterval, READ_ORDERS, strategyKey]);

  return (
    <ProfitSummary
      timeInterval={timeInterval}
      orderHistory={orderHistory}
      strategyKind={strategyKind}
    />
  );
};
