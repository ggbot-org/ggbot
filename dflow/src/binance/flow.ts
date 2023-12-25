import { DflowGraph, DflowId } from "dflow"
import { FlowViewSerializableGraph } from "flow-view"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	dflowBinanceKlineIntervals,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"
import {
	DflowBinanceSymbolAndInterval,
	DflowBinanceSymbolInfo,
	dflowBinanceSymbolSeparator,
	isDflowBinanceSymbolAndInterval
} from "./symbols.js"

export const extractBinanceSymbolsAndIntervalsFromFlowCandles = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	flow: FlowViewSerializableGraph
): DflowBinanceSymbolAndInterval[] => {
	const symbols = binanceSymbols.map(({ symbol }) => symbol)
	const symbolsAndIntervals: DflowBinanceSymbolAndInterval[] = []
	const nodeConnections: Array<{ sourceId: DflowId; targetId: DflowId }> =
		flow.edges.map((edge) => ({
			sourceId: edge.from[0],
			targetId: edge.to[0]
		}))
	for (const node of flow.nodes) {
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
				const node = flow.nodes.find(({ id }) => id === parentNodeId)
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

export const extractsBinanceSymbolsFromTickerPriceAndOrderNodes = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	flow: FlowViewSerializableGraph
): string[] => {
	const symbolsFromTickerPrice = new Set<string>()
	const symbols = binanceSymbols.map(({ symbol }) => symbol)

	const nodeConnections: Array<{ sourceId: DflowId; targetId: DflowId }> =
		flow.edges.map((edge) => ({
			sourceId: edge.from[0],
			targetId: edge.to[0]
		}))
	for (const node of flow.nodes) {
		if (
			[BuyMarket.kind, SellMarket.kind, TickerPrice.kind].includes(
				node.text
			)
		) {
			const parentNodeIds = DflowGraph.parentsOfNodeId(
				node.id,
				nodeConnections
			)
			for (const parentNodeId of parentNodeIds) {
				const node = flow.nodes.find(({ id }) => id === parentNodeId)
				if (!node) continue
				const maybeSymbol = node.text
					.split(dflowBinanceSymbolSeparator)
					.join("")
				if (symbols.includes(maybeSymbol))
					symbolsFromTickerPrice.add(maybeSymbol)
			}
		}
	}
	// Return deduplicated and sorted result.
	return Array.from(symbolsFromTickerPrice.values()).sort()
}
