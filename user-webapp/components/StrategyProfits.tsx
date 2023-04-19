import { Orders, isOrders } from "@ggbot2/models";
import {
  TimeInterval,
  truncateTime,
  now,
  getTime,
  timeIntervalToDay,
} from "@ggbot2/time";
import { FC, useEffect, useMemo } from "react";
import { ProfitSummary } from "_components/ProfitSummary";
import { useApi } from "_hooks/useApi";
import { StrategyKey } from "_routing/types";

type Props = {
  strategyKey: StrategyKey;
};

export const StrategyProfits: FC<Props> = ({ strategyKey }) => {
  const { strategyKind } = strategyKey;
  const numDays = 30;

  const timeInterval = useMemo<TimeInterval>(() => {
    const time = now();
    const today = truncateTime(time).to.day();
    const end = today;
    const start = getTime(end).minus(numDays).days();
    return { start, end };
  }, []);

  const [READ_ORDERS, { data: orders }] = useApi.ReadStrategyOrders();

  const orderHistory = useMemo<Orders>(
    () => (isOrders(orders) ? orders : []),
    [orders]
  );

  const dayInterval = useMemo(
    () => timeIntervalToDay(timeInterval),
    [timeInterval]
  );

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
