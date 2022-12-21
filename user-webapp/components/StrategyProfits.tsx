import {
  BalanceChangeEvents,
  // Orders,
  // isOrders,
  isStrategyBalance,
} from "@ggbot2/models";
import {
  TimeInterval,
  truncateTime,
  now,
  getTime,
  timeIntervalToDay,
} from "@ggbot2/time";
import { Section } from "@ggbot2/ui-components";
import { FC, useEffect, useMemo } from "react";
import { ProfitSummary } from "_components";
import { useApiAction } from "_hooks";
import type { StrategyKey } from "_routing";

type Props = {
  strategyKey: StrategyKey;
};

export const StrategyProfits: FC<Props> = ({ strategyKey }) => {
  const timeInterval = useMemo<TimeInterval>(() => {
    const time = now();
    const today = truncateTime(time).to.day();
    const end = today;
    const start = getTime(end).minus(7).days();
    return { start, end };
  }, []);

  const [readBalances, { data: balances }] =
    useApiAction.ReadStrategyBalances();
  // const [readOrders, { data: orders }] = useApiAction.ReadStrategyDailyOrders();

  const balanceHistory = useMemo<BalanceChangeEvents>(() => {
    const balanceHistory: BalanceChangeEvents = [];
    if (Array.isArray(balances))
      for (const balance of balances)
        if (isStrategyBalance(balance))
          for (const balanceChangeEvent of balance.data)
            balanceHistory.push(balanceChangeEvent);
    return balanceHistory;
  }, [balances]);

  // const orderHistory = useMemo<Orders>(
  //   () => (isOrders(orders) ? orders : []),
  //   [orders]
  // );

  const dayInterval = useMemo(
    () => timeIntervalToDay(timeInterval),
    [timeInterval]
  );

  useEffect(() => {
    const controller = readBalances({ ...strategyKey, ...dayInterval });
    return () => {
      controller.abort();
    };
  }, [dayInterval, readBalances, strategyKey]);

  // useEffect(() => {
  //   const controller = readOrders({ ...strategyKey, ...dayInterval });
  //   return () => {
  //     controller.abort();
  //   };
  // }, [dayInterval, readOrders, strategyKey]);

  return (
    <Section header="Profits">
      <ProfitSummary
        balanceHistory={balanceHistory}
        timeInterval={timeInterval}
        // orderHistory={orderHistory}
        orderHistory={[]}
      />
    </Section>
  );
};
