import { BalanceChangeEvents, isStrategyBalance } from "@ggbot2/models";
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

  const [request, { data: strategyBalances }] =
    useApiAction.ReadStrategyBalances();

  const balanceHistory = useMemo<BalanceChangeEvents>(() => {
    const balanceHistory: BalanceChangeEvents = [];
    if (Array.isArray(strategyBalances))
      for (const strategyBalance of strategyBalances)
        if (isStrategyBalance(strategyBalance))
          for (const balanceChangeEvent of strategyBalance.data)
            balanceHistory.push(balanceChangeEvent);
    return balanceHistory;
  }, [strategyBalances]);

  useEffect(() => {
    const dayInterval = timeIntervalToDay(timeInterval);
    request({ ...strategyKey, ...dayInterval });
  }, [request, timeInterval, strategyKey]);

  return (
    <Section header="Profits">
      <ProfitSummary
        balanceHistory={balanceHistory}
        timeInterval={timeInterval}
      />
    </Section>
  );
};
