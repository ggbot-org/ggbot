import { add } from "@ggbot2/arithmetic";
import type { Balance, BalanceChangeEvent } from "@ggbot2/models";
import type { TimeInterval } from "@ggbot2/time";
import { DateTime, Pill } from "@ggbot2/ui-components";
import { FC, useMemo } from "react";

type Props = {
  timeInterval: TimeInterval | undefined;
  balanceHistory: BalanceChangeEvent[];
};

const customAssetSort = ["BTC", "ETH", "BNB", "BUSD"];

export const ProfitSummary: FC<Props> = ({ balanceHistory, timeInterval }) => {
  const { totalBalance, assets } = useMemo(() => {
    const balancesMap = new Map<Balance["asset"], Balance>();
    for (const { balances } of balanceHistory) {
      for (const balance of balances) {
        const currentBalance = balancesMap.get(balance.asset);
        if (currentBalance)
          balancesMap.set(balance.asset, {
            asset: balance.asset,
            free: add(balance.free, currentBalance.free),
            locked: add(balance.locked, currentBalance.locked),
          });
        else balancesMap.set(balance.asset, balance);
      }
    }
    return {
      assets: Array.from(balancesMap.keys()).sort((a, b) => {
        const aHasPrority = customAssetSort.includes(a);
        const bHasPrority = customAssetSort.includes(b);
        const aIndex = customAssetSort.indexOf(a);
        const bIndex = customAssetSort.indexOf(b);

        if (aHasPrority && bHasPrority) {
          if (aIndex < bIndex) return -1;
          if (aIndex > bIndex) return 1;
        } else if (aHasPrority && !bHasPrority) {
          return -1;
        } else if (!aHasPrority && bHasPrority) {
          return 1;
        } else {
          if (a < b) return -1;
          if (a > b) return 1;
        }
        return 0;
      }),
      totalBalance: Object.fromEntries(balancesMap.entries()),
    };
  }, [balanceHistory]);

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex gap-2">
          <span>from</span>
          <DateTime format="day" value={timeInterval?.start} />
        </div>

        <div className="flex gap-2">
          <span>to</span>
          <DateTime format="day" value={timeInterval?.end} />
        </div>
      </div>

      <div className="flex flex-row gap-2">
        {assets.map((asset) => (
          <div key={asset}>
            <Pill>{asset}</Pill>
            <Pill>{totalBalance[asset]?.free}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
};
