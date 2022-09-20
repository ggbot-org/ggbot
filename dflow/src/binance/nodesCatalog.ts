import {BinanceExchangeInfo, binanceKlineIntervals} from "@ggbot2/binance";
import {DflowNodesCatalog, DflowNode} from "dflow";
import {nodesCatalog as commonNodesCatalog} from "../common/nodesCatalog.js";
import {binanceWantedPrecision} from "./arithmetic.js";
import {binanceNodeSymbolKind} from "./nodeResolution.js";
import {Addition} from "./nodes/arithmetic.js";
import {TickerPrice} from "./nodes/market.js";
import {MarketBuy, MarketSell} from "./nodes/trade.js";

const {output} = DflowNode;

type GetDflowBinanceNodesCatalog = (
  arg: Pick<BinanceExchangeInfo, "symbols">
) => DflowNodesCatalog;

/**
 * Creates a dynamic set of dflow nodes generated according to Binance definitions.
 */
export const getDflowBinanceDynamicNodesCatalog: GetDflowBinanceNodesCatalog =
  ({symbols}) => {
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
        return {...catalog, [NodeClass.kind]: NodeClass};
      },
      {}
    );

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
      .reduce((catalog, {baseAsset, quoteAsset, symbol}) => {
        class NodeClass extends DflowNode {
          static kind = binanceNodeSymbolKind({baseAsset, quoteAsset})
          static outputs = [
            output("string", {
              name: "symbol",
              data: symbol,
            }),
          ];
        }
        return {...catalog, [NodeClass.kind]: NodeClass};
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
    // arithmetic
    [Addition.kind]: Addition,
    // market
    [TickerPrice.kind]: TickerPrice,
    // trade
    [MarketBuy.kind]: MarketBuy,
    [MarketSell.kind]: MarketSell,
    ...commonNodesCatalog,
  };

  const dynamicNodes = getDflowBinanceDynamicNodesCatalog(arg);

  return {
    ...dynamicNodes,
    ...staticNodes,
  };
};
