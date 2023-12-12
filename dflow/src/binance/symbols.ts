import { BinanceExchangeInfo, BinanceSymbolInfo } from "@workspace/binance"
import { DflowGraph, DflowId } from "dflow"
import { FlowViewSerializableGraph } from "flow-view"
import { MaybeObject, objectTypeGuard } from "minimal-type-guard-helpers"

import { dflowBinancePrecision } from "./arithmetic.js"
import {
	DflowBinanceKlineInterval,
	dflowBinanceKlineIntervals,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"
import { Candles } from "./nodes/market.js"

export type DflowBinanceSymbolInfo = Pick<
	BinanceSymbolInfo,
	| "baseAsset"
	| "baseAssetPrecision"
	| "baseCommissionPrecision"
	| "filters"
	| "isSpotTradingAllowed"
	| "quoteAsset"
	| "quoteAssetPrecision"
	| "quotePrecision"
	| "status"
	| "symbol"
>

export const isDflowBinanceSymbolInfo = objectTypeGuard<DflowBinanceSymbolInfo>(
	({
		baseAsset,
		baseAssetPrecision,
		baseCommissionPrecision,
		isSpotTradingAllowed,
		quoteAsset,
		quoteAssetPrecision,
		quotePrecision,
		status,
		symbol
	}) =>
		isSpotTradingAllowed === true &&
		status === "TRADING" &&
		typeof symbol === "string" &&
		typeof baseAsset === "string" &&
		typeof quoteAsset === "string" &&
		symbol === `${baseAsset}${quoteAsset}` &&
		// Most of the Binance symbols has precision 8. Others are edge case markets.
		// TODO remove this
		baseAssetPrecision === dflowBinancePrecision &&
		baseCommissionPrecision === dflowBinancePrecision &&
		quoteAssetPrecision === dflowBinancePrecision &&
		quotePrecision === dflowBinancePrecision
)

export const binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols = (
	symbols: BinanceExchangeInfo["symbols"]
): DflowBinanceSymbolInfo[] =>
	symbols
		.filter(isDflowBinanceSymbolInfo)
		.map(
			({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				quotePrecision,
				status,
				symbol
			}) => ({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				quotePrecision,
				status,
				symbol
			})
		)

const dflowBinanceSymbolSeparator = "/"

export const getDflowBinanceNodeSymbolKind = ({
	baseAsset,
	quoteAsset
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) =>
	[baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator)

type DflowBinanceSymbolAndInterval = {
	symbol: string
	interval: DflowBinanceKlineInterval
}

const isDflowBinanceSymbolAndInterval =
	objectTypeGuard<DflowBinanceSymbolAndInterval>(({ symbol, interval }) => {
		if (typeof symbol !== "string") return false
		if (!isDflowBinanceKlineInterval(interval)) return false
		return true
	})

// TODO it checks Candles nodes, should also check (add testss too) price nodes.
export const extractBinanceFlowSymbolsAndIntervalsFromFlow = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	view: FlowViewSerializableGraph
): DflowBinanceSymbolAndInterval[] => {
	const symbols = binanceSymbols.map(({ symbol }) => symbol)
	const symbolsAndIntervals: DflowBinanceSymbolAndInterval[] = []
	const nodeConnections: Array<{ sourceId: DflowId; targetId: DflowId }> =
		view.edges.map((edge) => ({
			sourceId: edge.from[0],
			targetId: edge.to[0]
		}))
	for (const node of view.nodes) {
		if (node.text === Candles.kind) {
			const parentNodeIds = DflowGraph.parentsOfNodeId(
				node.id,
				nodeConnections
			)
			const maybeSymbolAndInterval: MaybeObject<DflowBinanceSymbolAndInterval> =
				{
					symbol: undefined,
					interval: undefined
				}
			for (const parentNodeId of parentNodeIds) {
				const node = view.nodes.find(({ id }) => id === parentNodeId)
				if (!node) continue
				if (isDflowBinanceKlineInterval(node.text)) {
					maybeSymbolAndInterval.interval = node.text
					continue
				} else {
					const maybeSymbol = node.text
						.split(dflowBinanceSymbolSeparator)
						.join("")
					if (symbols.includes(maybeSymbol))
						maybeSymbolAndInterval.symbol = maybeSymbol
				}
			}
			if (isDflowBinanceSymbolAndInterval(maybeSymbolAndInterval)) {
				symbolsAndIntervals.push(maybeSymbolAndInterval)
			}
		}
	}
	return symbolsAndIntervals
		.filter(
			// Remove duplicates.
			({ symbol, interval }, index, array) =>
				index ===
				array.findIndex(
					(element) =>
						element.symbol === symbol &&
						element.interval === interval
				)
		)
		.sort(
			// Sort by symbol and interval.
			(
				{ symbol: symbolA, interval: intervalA },
				{ symbol: symbolB, interval: intervalB }
			) => {
				if (symbolA > symbolB) return 1
				if (symbolA < symbolB) return -1
				return dflowBinanceKlineIntervals.indexOf(intervalA) >
					dflowBinanceKlineIntervals.indexOf(intervalB)
					? 1
					: -1
			}
		)
}
