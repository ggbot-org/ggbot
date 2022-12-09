import type { BalanceChangeEvent } from "@ggbot2/models";
import { TimeInterval, truncateTime, now, getTime } from "@ggbot2/time";
import { FC, useMemo } from "react";
import { ProfitSummary } from "_components";
import type { StrategyKey } from "_routing";

type Props = {
  strategyKey: StrategyKey;
};

export const StrategyProfits: FC<Props> = () => {
  const balanceHistory: BalanceChangeEvent[] = [];
  const timeInterval = useMemo<TimeInterval>(() => {
    const time = now();
    const today = truncateTime(time).to.day();
    const end = getTime(today).minus(1).days();
    const start = getTime(end).minus(7).days();
    return { start, end };
  }, []);

  return (
    <div>
      <ProfitSummary
        balanceHistory={balanceHistory}
        timeInterval={timeInterval}
      />
    </div>
  );
};
