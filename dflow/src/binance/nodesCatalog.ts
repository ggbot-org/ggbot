import { binanceKlineIntervals } from "@ggbot2/binance";
import { DflowNodesCatalog, DflowNode } from "dflow";
import { nodesCatalog as commonNodesCatalog } from "../common/nodesCatalog.js";
import { binanceWantedPrecision } from "./arithmetic.js";
import { Binance } from "./executor.js";
import { AvgPrice } from "./nodes/market.js";
import { MarketBuy, MarketSell } from "./nodes/trade.js";

const { output } = DflowNode;

type GetDflowBinanceNodesCatalog = (_: {
  binance: Binance;
}) => Promise<DflowNodesCatalog>;

/**
 * Creates a dynamic set of dflow nodes generated according to Binance definitions", () => {
 */
export const getDflowBinanceNodesCatalog: GetDflowBinanceNodesCatalog = async ({
  binance,
}) => {
  const staticNodes = {
    // market
    [AvgPrice.kind]: AvgPrice,
    // trade
    [MarketBuy.kind]: MarketBuy,
    [MarketSell.kind]: MarketSell,
    ...commonNodesCatalog,
  };

  const klineIntervalNodes = binanceKlineIntervals.reduce(
    (catalog, klineInterval) => {
      class NodeClass extends DflowNode {
        static kind = klineInterval;
        static outputs = [
          output("string", {
            name: "interval",
            data: klineInterval,
          }),
        ];
      }
      return { ...catalog, [NodeClass.kind]: NodeClass };
    },
    {}
  );

  const { symbols } = await binance.exchangeInfo();

  const symbolNodes = symbols
    .filter(
      // Most of the Binance symbols has precision 8. Others are edge case markets.
      ({
        baseAssetPrecision,
        baseCommissionPrecision,
        quoteAssetPrecision,
        quotePrecision,
      }) =>
        baseAssetPrecision === binanceWantedPrecision &&
        baseCommissionPrecision === binanceWantedPrecision &&
        quoteAssetPrecision === binanceWantedPrecision &&
        quotePrecision === binanceWantedPrecision
    )
    .reduce((catalog, { baseAsset, quoteAsset, symbol }) => {
      class NodeClass extends DflowNode {
        static kind = `${baseAsset}/${quoteAsset}`;
        static outputs = [
          output("string", {
            name: "symbol",
            data: symbol,
          }),
        ];
      }
      return { ...catalog, [NodeClass.kind]: NodeClass };
    }, {});

  return {
    ...klineIntervalNodes,
    ...staticNodes,
    ...symbolNodes,
  };
};