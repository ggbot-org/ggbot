import { BinanceKlineInterval, BinanceSymbolInfo } from "@ggbot2/binance";
import { StrategyFlow } from "@ggbot2/models";
import { objectTypeGuard } from "@ggbot2/type-utils";
import { DflowGraph, DflowId } from "dflow";
import { dflowBinancePrecision } from "./arithmetic.js";
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
  _binanceSymbols: DflowBinanceSymbolInfo[],
  view: StrategyFlow["view"]
): { symbol: string; interval: BinanceKlineInterval }[] => {
  // const symbols = binanceSymbols.map(({ symbol }) => symbol);
  const result: { symbol: string; interval: BinanceKlineInterval }[] = [];
  const nodeConnections: { sourceId: DflowId; targetId: DflowId }[] = view.edges.map((edge) => ({
    sourceId: edge.from[0],
    targetId: edge.to[0],
  }));
  for (const node of view.nodes) {
    if (node.text === Candles.kind) {
      const parents = DflowGraph.parentsOfNodeId(node.id, nodeConnections);
      console.log(parents);
    }
  }
  return result;
};
