import { add, decimalToNumber, mul, sub } from "@ggbot2/arithmetic";
import {
  BinanceConnector,
  BinanceSymbolInfo,
  BinanceExchange,
  BinanceCacheMap,
  isBinanceOrderRespFULL,
} from "@ggbot2/binance";
import {
  Box,
  DateTime,
  Flex,
  Heading,
  Level,
  LevelItem,
  Title,
  SizeModifierProp,
} from "@ggbot2/design";
import { Order, StrategyKind } from "@ggbot2/models";
import { TimeInterval } from "@ggbot2/time";
import { classNames } from "_classNames";
import { useIsServerSide } from "_hooks/useIsServerSide";
import { miscellaneousLabel, title } from "_i18n";
import { FC, Fragment, PropsWithChildren, useEffect } from "react";

type Props = {
  timeInterval: TimeInterval | undefined;
  orderHistory: Order[];
  strategyKind?: StrategyKind | undefined;
};

const binanceSymbols = new Map<
  BinanceSymbolInfo["symbol"],
  Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">
>();

const _Label: FC<PropsWithChildren<SizeModifierProp<"large">>> = ({
  children,
  size,
}) => (
  <Heading className={classNames({ "is-size-6": size === "large" })}>
    {children}
  </Heading>
);

const _Value: FC<PropsWithChildren<SizeModifierProp<"large">>> = ({
  children,
  size = "normal",
}) =>
  children ? (
    <p
      className={classNames("has-text-weight-medium", {
        "is-size-5": size === "normal",
        "is-size-3": size === "large",
      })}
    >
      {children}
    </p>
  ) : (
    <>&nbsp;</>
  );

type Fee = {
  asset: string;
  quantity: string;
};

type SymbolStats = {
  symbol: string;
  maxPrice: string;
  minPrice: string;
  baseQuantity: string;
  quoteQuantity: string;
};

export const ProfitSummary: FC<Props> = ({
  orderHistory,
  timeInterval,
  strategyKind,
}) => {
  const isServerSide = useIsServerSide();

  let numBuys: number | undefined = undefined;
  let numSells: number | undefined = undefined;

  const fees = new Map<Fee["asset"], Fee["quantity"]>();
  const symbolStats = new Map<
    SymbolStats["symbol"],
    Omit<SymbolStats, "symbol">
  >();

  if (strategyKind === "binance") {
    for (const { info } of orderHistory) {
      if (isBinanceOrderRespFULL(info)) {
        // TODO assuming type=MARKET status=FILLED
        const { fills, side, symbol } = info;

        const isBuy = side === "BUY";

        // Count buys and sells.
        if (isBuy) {
          numBuys === undefined ? (numBuys = 1) : numBuys++;
        } else {
          numSells === undefined ? (numSells = 1) : numSells++;
        }

        for (const {
          commission,
          commissionAsset,
          price,
          qty: baseQty,
        } of fills) {
          const quoteQty = mul(price, baseQty);

          // Sum fees.
          const previousFees = fees.get(commissionAsset);
          if (previousFees) {
            fees.set(commissionAsset, add(previousFees, commission));
          } else {
            fees.set(commissionAsset, commission);
          }

          // Statistics.
          const previousSymbolStats = symbolStats.get(symbol);
          if (previousSymbolStats) {
            const { minPrice, maxPrice, baseQuantity, quoteQuantity } =
              previousSymbolStats;
            symbolStats.set(symbol, {
              baseQuantity: isBuy
                ? add(baseQuantity, baseQty)
                : sub(baseQuantity, baseQty),
              quoteQuantity: isBuy
                ? sub(quoteQuantity, quoteQty)
                : add(quoteQuantity, quoteQty),
              minPrice:
                decimalToNumber(price) < decimalToNumber(minPrice)
                  ? price
                  : minPrice,
              maxPrice:
                decimalToNumber(price) > decimalToNumber(maxPrice)
                  ? price
                  : maxPrice,
            });
          } else {
            symbolStats.set(symbol, {
              baseQuantity: isBuy ? add(0, baseQty) : sub(0, baseQty),
              quoteQuantity: isBuy ? sub(0, quoteQty) : add(0, quoteQty),
              minPrice: price,
              maxPrice: price,
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    if (strategyKind !== "binance") return;
    // TODO put Binance Exchange info in some context and
    // also cache it session storage
    const binance = new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
      cache: new BinanceCacheMap(),
    });
    (async () => {
      const { symbols } = await binance.exchangeInfo();
      for (const { symbol, baseAsset, quoteAsset } of symbols) {
        binanceSymbols.set(symbol, { baseAsset, quoteAsset });
      }
    })();
  }, [strategyKind]);

  if (isServerSide) return null;

  return (
    <Box>
      <Title>{title.profits}</Title>

      <Level>
        <LevelItem>
          <Flex direction="column" spacing={{ mx: 2 }}>
            <_Label>{miscellaneousLabel.from}</_Label>

            <_Value>
              <DateTime format="day" value={timeInterval?.start} />
            </_Value>
          </Flex>

          <Flex direction="column" spacing={{ mx: 2 }}>
            <_Label>{miscellaneousLabel.to}</_Label>

            <_Value>
              <DateTime format="day" value={timeInterval?.end} />
            </_Value>
          </Flex>
        </LevelItem>

        <LevelItem hasText="centered">
          <div>
            <_Label size="large">{miscellaneousLabel.numBuys}</_Label>

            <_Value size="large">{numBuys}</_Value>
          </div>
        </LevelItem>

        <LevelItem hasText="centered">
          <div>
            <_Label size="large">{miscellaneousLabel.numSells}</_Label>

            <_Value size="large">{numSells}</_Value>
          </div>
        </LevelItem>
      </Level>

      {Array.from(
        symbolStats,
        ([symbol, { minPrice, maxPrice, baseQuantity, quoteQuantity }]) => ({
          symbol,
          minPrice,
          maxPrice,
          baseQuantity,
          quoteQuantity,
        })
      )
        .map(({ symbol, ...rest }) => {
          const binanceSymbol = binanceSymbols.get(symbol);
          if (binanceSymbol) {
            const { baseAsset, quoteAsset } = binanceSymbol;
            return {
              baseAsset,
              quoteAsset,
              symbol,
              ...rest,
            };
          } else {
            return {
              baseAsset: "",
              quoteAsset: "",
              symbol,
              ...rest,
            };
          }
        })
        .map(
          ({
            baseAsset,
            baseQuantity,
            maxPrice,
            minPrice,
            quoteAsset,
            quoteQuantity,
            symbol,
          }) => (
            <Fragment key={symbol}>
              <Level>
                <LevelItem>
                  <Title size={4}>{symbol}</Title>
                </LevelItem>

                <LevelItem hasText="centered">
                  <div>
                    <_Label size="large">{baseAsset}</_Label>

                    <_Value size="large">{baseQuantity}</_Value>
                  </div>
                </LevelItem>

                <LevelItem hasText="centered">
                  <div>
                    <_Label size="large">{quoteAsset}</_Label>

                    <_Value size="large">{quoteQuantity}</_Value>
                  </div>
                </LevelItem>
              </Level>

              <Level>
                <LevelItem hasText="centered">
                  <div>
                    <_Label>{miscellaneousLabel.minPrice}</_Label>

                    <_Value>{minPrice}</_Value>
                  </div>
                </LevelItem>

                <LevelItem hasText="centered">
                  <div>
                    <_Label>{miscellaneousLabel.maxPrice}</_Label>

                    <_Value>{maxPrice}</_Value>
                  </div>
                </LevelItem>
              </Level>
            </Fragment>
          )
        )}

      <Level>
        <LevelItem>
          <Heading>{miscellaneousLabel.fees}</Heading>
        </LevelItem>

        {Array.from(fees, ([asset, quantity]) => ({ asset, quantity })).map(
          ({ asset, quantity }) => (
            <LevelItem key={asset} hasText="centered">
              <div>
                <_Label>{asset}</_Label>

                <_Value>{quantity}</_Value>
              </div>
            </LevelItem>
          )
        )}
      </Level>
    </Box>
  );
};
