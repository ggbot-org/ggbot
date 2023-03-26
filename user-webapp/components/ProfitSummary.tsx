import { isBinanceOrderRespFULL } from "@ggbot2/binance";
import { Box, DateTime, Level, LevelItem, Title } from "@ggbot2/design";
import { useIsServerSide } from "@ggbot2/hooks";
import { Order, StrategyKind } from "@ggbot2/models";
import { TimeInterval } from "@ggbot2/time";
import { FC } from "react";

type Props = {
  timeInterval: TimeInterval | undefined;
  orderHistory: Order[];
  strategyKind?: StrategyKind | undefined;
};

export const ProfitSummary: FC<Props> = ({
  orderHistory,
  timeInterval,
  strategyKind,
}) => {
  const isServerSide = useIsServerSide();

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

  if (isServerSide) return null;

  return (
    <Box>
      <Level
        isMobile
        left={
          <LevelItem>
            <Title>Profits</Title>
          </LevelItem>
        }
        right={
          <>
            <LevelItem hasText="centered">
              <div>
                {<p>From</p>}
                <DateTime format="day" value={timeInterval?.start} />
              </div>
            </LevelItem>

            <LevelItem hasText="centered">
              <div>
                {<p>To</p>}
                <DateTime format="day" value={timeInterval?.end} />
              </div>
            </LevelItem>
          </>
        }
      />

      {strategyKind === "binance" && (
        <Level>
          <LevelItem hasText="centered">
            <div>
              {<p>Num. buys</p>}
              <Title>
                {typeof numBuys === "number" ? <>{numBuys}</> : <>&nbsp;</>}
              </Title>
            </div>
          </LevelItem>

          <LevelItem hasText="centered">
            <div>
              {<p>Num. sells</p>}
              <Title>
                {typeof numSells === "number" ? <>{numSells}</> : <>&nbsp;</>}
              </Title>
            </div>
          </LevelItem>
        </Level>
      )}
    </Box>
  );
};
