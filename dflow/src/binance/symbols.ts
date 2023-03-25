import { BinanceKlineInterval, BinanceSymbolInfo } from "@ggbot2/binance";
import { StrategyFlow } from "@ggbot2/models";
import { objectTypeGuard } from "@ggbot2/type-utils";
import { DflowGraph, DflowId } from "dflow";
import { dflowBinancePrecision } from "./arithmetic.js";
import {
  DflowBinanceKlineInterval,
  dflowBinanceKlineIntervals,
  isDflowBinanceKlineInterval,
} from "./klineIntervals.js";
import { Candles } from "./nodes/market.js";

export const dflowBinanceQuoteAssets = ["BNB", "BTC", "BUSD", "ETH"];

export type DflowBinanceSymbolInfo = Pick<
  BinanceSymbolInfo,
  | "baseAsset"
  | "baseAssetPrecision"
  | "baseCommissionPrecision"
  | "isSpotTradingAllowed"
  | "quoteAsset"
  | "quoteAssetPrecision"
  | "quotePrecision"
  | "status"
  | "symbol"
>;

export const isDflowBinanceSymbolInfo = objectTypeGuard<DflowBinanceSymbolInfo>(
  ({
    baseAsset,
    baseAssetPrecision,
    baseCommissionPrecision,
    quoteAsset,
    quoteAssetPrecision,
    quotePrecision,
    isSpotTradingAllowed,
    status,
    symbol,
  }) =>
    isSpotTradingAllowed === true &&
    status === "TRADING" &&
    typeof symbol === "string" &&
    typeof baseAsset === "string" &&
    typeof quoteAsset === "string" &&
    symbol === `${baseAsset}${quoteAsset}` &&
    dflowBinanceQuoteAssets.includes(quoteAsset) &&
    // Most of the Binance symbols has precision 8. Others are edge case markets.
    baseAssetPrecision === dflowBinancePrecision &&
    baseCommissionPrecision === dflowBinancePrecision &&
    quoteAssetPrecision === dflowBinancePrecision &&
    quotePrecision === dflowBinancePrecision
);

const dflowBinanceSymbolSeparator = "/";

export const getDflowBinanceNodeSymbolKind = ({
  baseAsset,
  quoteAsset,
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) =>
  [baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator);

export const extractBinanceSymbolsAndIntervalsFromFlow = (
  binanceSymbols: DflowBinanceSymbolInfo[],
  view: StrategyFlow["view"]
) => {
  const symbols = binanceSymbols.map(({ symbol }) => symbol);
  const result: { symbol: string; interval: BinanceKlineInterval }[] = [];
  const nodeConnections: { sourceId: DflowId; targetId: DflowId }[] =
    view.edges.map((edge) => ({
      sourceId: edge.from[0],
      targetId: edge.to[0],
    }));
  for (const node of view.nodes) {
    if (node.text === Candles.kind) {
      const parentNodeIds = DflowGraph.parentsOfNodeId(
        node.id,
        nodeConnections
      );
      let symbol;
      let interval;
      for (const parentNodeId of parentNodeIds) {
        const node = view.nodes.find(({ id }) => id === parentNodeId);
        if (!node) continue;
        if (isDflowBinanceKlineInterval(node.text)) {
          interval = node.text;
          continue;
        } else {
          const maybeSymbol = node.text
            .split(dflowBinanceSymbolSeparator)
            .join("");
          if (symbols.includes(maybeSymbol)) symbol = maybeSymbol;
        }
      }
      if (symbol && interval) {
        result.push({ symbol, interval });
      }
    }
  }
  return result
    .filter(
      // Remove duplicates.
      ({ symbol, interval }, index, array) =>
        index ===
        array.findIndex(
          (element) =>
            element.symbol === symbol && element.interval === interval
        )
    )
    .sort(
      // Sort by symbol and interval.
      (
        { symbol: symbolA, interval: intervalA },
        { symbol: symbolB, interval: intervalB }
      ) => {
        // TODO improve this, should remove castings
        const intervalIndexA = dflowBinanceKlineIntervals.indexOf(
          intervalA as DflowBinanceKlineInterval
        ) as number;
        const intervalIndexB = dflowBinanceKlineIntervals.indexOf(
          intervalB as DflowBinanceKlineInterval
        ) as number;
        if (symbolA > symbolB) return 1;
        if (symbolA < symbolB) return -1;
        return intervalIndexA > intervalIndexB ? 1 : -1;
      }
    );
};
