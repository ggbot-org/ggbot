import { add, Decimal } from "@ggbot2/arithmetic";
import { isBinanceOrderRespFULL } from "@ggbot2/binance";
import { DateTime, Tag } from "@ggbot2/design";
import { useIsServerSide } from "@ggbot2/hooks";
import { Balance, BalanceChangeEvent, Order, StrategyKind } from "@ggbot2/models";
import { TimeInterval, timeToDay } from "@ggbot2/time";
import { FC, useId, useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import color from "../styles/colors.module.scss";

type Props = {
  timeInterval: TimeInterval | undefined;
  balanceHistory: BalanceChangeEvent[];
  orderHistory: Order[];
  strategyKind?: StrategyKind | undefined;
};

const customAssetSort = ["BTC", "ETH", "BNB", "BUSD"];

export const ProfitSummary: FC<Props> = ({ balanceHistory, orderHistory, timeInterval, strategyKind }) => {
  const isServerSide = useIsServerSide();
  const freeDailyBalanceChartsSyncId = useId();

  const { numBuys, numSells } = useMemo<{
    numBuys: undefined | number;
    numSells: undefined | number;
  }>(() => {
    let numBuys = 0;
    let numSells = 0;
    if (strategyKind === "binance") {
      for (const { info } of orderHistory) {
        if (isBinanceOrderRespFULL(info)) {
          const { side } = info;
          if (side === "BUY") numBuys++;
          if (side === "SELL") numSells++;
        }
      }
    }
    return { numBuys, numSells };
  }, [orderHistory, strategyKind]);

  const { dailyBalance, totalBalance, assets } = useMemo(() => {
    const totalBalancesMap = new Map<Balance["asset"], Pick<Balance, "free">>();
    const dailyBalancesMap = new Map<
      Balance["asset"],
      Array<{ name: string; freeDecimal: Decimal; free: number }>
    >();

    for (const { balances, whenCreated } of balanceHistory) {
      for (const { asset, free } of balances) {
        const freeNum = Number(free);

        const currentTotalBalance = totalBalancesMap.get(asset);
        if (currentTotalBalance)
          totalBalancesMap.set(asset, {
            free: add(free, currentTotalBalance.free),
          });
        else totalBalancesMap.set(asset, { free });

        const day = timeToDay(whenCreated);
        const currentDailyBalances = dailyBalancesMap.get(asset);
        if (currentDailyBalances) {
          const currentDailyBalance = currentDailyBalances.find(({ name }) => name === day);
          if (currentDailyBalance) {
            dailyBalancesMap.set(
              asset,
              currentDailyBalances
                .map((dailyBalance) => {
                  if (dailyBalance.name !== day) return dailyBalance;
                  const sum = add(free, dailyBalance.freeDecimal);
                  return { name: day, free: Number(sum), freeDecimal: sum };
                })
                .sort((a, b) => (a.name < b.name ? -1 : 1))
            );
          } else
            dailyBalancesMap.set(
              asset,
              currentDailyBalances.concat({
                name: day,
                free: freeNum,
                freeDecimal: free,
              })
            );
        } else dailyBalancesMap.set(asset, [{ name: day, free: freeNum, freeDecimal: free }]);
      }
    }

    const assets = Array.from(totalBalancesMap.keys()).sort((a, b) => {
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
    });

    return {
      assets,
      dailyBalance: Object.fromEntries(dailyBalancesMap.entries()),
      totalBalance: Object.fromEntries(totalBalancesMap.entries()),
    };
  }, [balanceHistory]);

  if (isServerSide) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex gap-2">
          <span>From</span>
          <DateTime format="day" value={timeInterval?.start} />
        </div>

        <div className="flex gap-2">
          <span>To</span>
          <DateTime format="day" value={timeInterval?.end} />
        </div>
      </div>

      {strategyKind === "binance" && (
        <div className="flex gap-2">
          {typeof numBuys === "number" && <span>Num buys: {numBuys}</span>}

          {typeof numSells === "number" && <span>Num sells: {numSells}</span>}
        </div>
      )}

      <div className="flex flex-row gap-2">
        {assets.map((asset) => (
          <div key={asset}>
            <Tag>{asset}</Tag>
            <Tag>{totalBalance[asset].free}</Tag>
          </div>
        ))}
      </div>

      {strategyKind === "binance" && (
        <div className="flex flex-col gap-2">
          {assets.map((asset) => (
            <ResponsiveContainer key={asset} width="100%" height={150}>
              <LineChart height={100} data={dailyBalance[asset]} syncId={freeDailyBalanceChartsSyncId}>
                <Line connectNulls dataKey="free" stroke={color.purple} type="monotone" />
                <XAxis dataKey="name" domain={["dataMin", "dataMax"]} />
                <YAxis label={{ value: asset, angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [value, asset]} />
              </LineChart>
            </ResponsiveContainer>
          ))}
        </div>
      )}
    </div>
  );
};
