import { StrategyFlowGraph } from "@workspace/models"
import { Dflow, DflowId } from "dflow"
import { MaybeObject } from "minimal-type-guard-helpers"

import { DflowParameter } from "../common/parameters.js"
import {
	dflowBinanceKlineIntervals,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"
import { Candles, TickerPrice } from "./nodes/market.js"
// TODO import { IntervalParameter, SymbolParameter } from "./nodes/parameters.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"
import {
	DflowBinanceSymbolAndInterval,
	DflowBinanceSymbolInfo,
	dflowBinanceSymbolSeparator,
	isDflowBinanceSymbolAndInterval
} from "./symbols.js"

export const extractBinanceParameters = (
	_binanceSymbols: DflowBinanceSymbolInfo[],
	_flow: StrategyFlowGraph
) => {
	// TODO const symbols = binanceSymbols.map(({ symbol }) => symbol)
	const parameters: DflowParameter[] = []
	// TODO
	// for (const { kind, key, defaultValueNodeText } of extractedParameters) {
	// 	if (
	// 		kind === IntervalParameter.kind &&
	// 		isDflowBinanceKlineInterval(defaultValueNodeText)
	// 	)
	// 		parameters.push({
	// 			kind,
	// 			key,
	// 			defaultValue: defaultValueNodeText
	// 		})
	//
	// 	if (kind === SymbolParameter.kind) {
	// 		if (typeof defaultValueNodeText !== "string") continue
	// 		const maybeSymbol = defaultValueNodeText
	// 			.split(dflowBinanceSymbolSeparator)
	// 			.join("")
	//
	// 		if (symbols.includes(maybeSymbol))
	// 			parameters.push({
	// 				kind,
	// 				key,
	// 				defaultValue: defaultValueNodeText
	// 			})
	// 	}
	// }
	return parameters
}

// TODO this is implemented with static analysis
// it would need to run the flow with a custom candles node that
// extracts the symbol and interval
// Uncomment test in flow_test.ts
export const extractBinanceSymbolsAndIntervalsFromFlowCandles = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	flow: StrategyFlowGraph
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
			const parentNodeIds = Dflow.parentsOfNodeId(
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

// TODO this is implemented with static analysis
// it would need to run the flow with a custom price and order nodes that
// extract the symbol
export const extractsBinanceSymbolsFromTickerPriceAndOrderNodes = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	flow: StrategyFlowGraph
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
			const parentNodeIds = Dflow.parentsOfNodeId(
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
