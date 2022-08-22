import { BinanceExchange, binanceKlineIntervals } from "@ggbot2/binance";
import { DflowNodesCatalog, DflowNode } from "dflow";
import { AvgPrice } from "./nodes/market.js";
import { MarketBuy, MarketSell } from "./nodes/trade.js";
import { nodesCatalog as commonNodesCatalog } from "../common/nodesCatalog.js";

const { output } = DflowNode;

type GetDflowBinanceNodesCatalog = (_: {
  binance: BinanceExchange;
}) => Promise<DflowNodesCatalog>;

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

  const symbolNodes = symbols.reduce(
    (catalog, { baseAsset, quoteAsset, symbol }) => {
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
    },
    {}
  );

  return {
    ...klineIntervalNodes,
    ...staticNodes,
    ...symbolNodes,
  };
};
