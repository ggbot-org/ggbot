import { BinanceKlineInterval } from "@ggbot2/binance";
import { DflowNodesCatalog, DflowNode } from "dflow";
import { nodesCatalog as commonNodesCatalog } from "../common/nodesCatalog.js";
import {
  DflowBinanceSymbolInfo,
  getDflowBinanceNodeSymbolKind,
  isDflowBinanceSymbolInfo,
} from "./symbols.js";
import { pinIntervalName, pinSymbolName } from "./nodes/commonIO.js";
import { Candles, TickerPrice } from "./nodes/market.js";
import { BuyMarket, SellMarket } from "./nodes/trade.js";

const { output } = DflowNode;

export type GetDflowBinanceNodesCatalogArg = {
  symbols: DflowBinanceSymbolInfo[];
};

type GetDflowBinanceNodesCatalog = (
  arg: GetDflowBinanceNodesCatalogArg
) => DflowNodesCatalog;

export const klineIntervals = [
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
] as const;
export const dflowBinanceLowerKlineInterval = klineIntervals[0];

/** Creates a dynamic set of dflow nodes generated according to Binance definitions. */
export const getDflowBinanceDynamicNodesCatalog: GetDflowBinanceNodesCatalog =
  ({ symbols }) => {
    const klineIntervalNodes = klineIntervals.reduce(
      (catalog, klineInterval) => {
        class NodeClass extends DflowNode {
          static kind = klineInterval;
          static outputs = [
            output("string", {
              name: pinIntervalName,
              data: klineInterval,
            }),
          ];
        }
        return { ...catalog, [NodeClass.kind]: NodeClass };
      },
      {}
    );

    const symbolNodes = symbols
      .filter(isDflowBinanceSymbolInfo)
      .reduce((catalog, { baseAsset, quoteAsset, symbol }) => {
        class NodeClass extends DflowNode {
          static kind = getDflowBinanceNodeSymbolKind({
            baseAsset,
            quoteAsset,
          });
          static outputs = [
            output("string", {
              name: pinSymbolName,
              data: symbol,
            }),
          ];
        }
        return { ...catalog, [NodeClass.kind]: NodeClass };
      }, {});

    return {
      ...klineIntervalNodes,
      ...symbolNodes,
    };
  };

export const getDflowBinanceNodesCatalog: GetDflowBinanceNodesCatalog = (
  arg
) => {
  const staticNodes = {
    // market
    [Candles.kind]: Candles,
    [TickerPrice.kind]: TickerPrice,
    // trade
    [BuyMarket.kind]: BuyMarket,
    [SellMarket.kind]: SellMarket,
    ...commonNodesCatalog,
  };

  const dynamicNodes = getDflowBinanceDynamicNodesCatalog(arg);

  return {
    ...dynamicNodes,
    ...staticNodes,
  };
};
