import { Dflow, DflowId } from "dflow"
import { FlowViewSerializableGraph } from "flow-view"
import { MaybeObject } from "minimal-type-guard-helpers"

import { DflowParameter } from "../parameters.js"
import {
	dflowBinanceKlineIntervals,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { IntervalParameter, SymbolParameter } from "./nodes/parameters.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"
import {
	DflowBinanceSymbolAndInterval,
	DflowBinanceSymbolInfo,
	dflowBinanceSymbolSeparator,
	isDflowBinanceSymbolAndInterval
} from "./symbols.js"

type DflowBinanceParameterKind =
	| typeof IntervalParameter.kind


export type DflowBinanceParameter = DflowParameter<DflowBinanceParameterKind>

export const extractBinanceParameters = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	flow: FlowViewSerializableGraph
): DflowBinanceParameter[] => {
	const symbols = binanceSymbols.map(({ symbol }) => symbol)
	const parameters: DflowBinanceParameter[] = []
	for (const node of flow.nodes) {
		const kind = node.text
		if (![IntervalParameter.kind, SymbolParameter.kind].includes(kind))
			continue
		const firstInputId = node.ins?.[0].id
		const secondInputId = node.ins?.[1].id
		const firstParentNodeEdge = flow.edges.find(
			(edge) => edge.to[1] === firstInputId
		)
		const secondParentNodeEdge = flow.edges.find(
			(edge) => edge.to[1] === secondInputId
		)
		const firstParentNode = flow.nodes.find(
			({ id }) => id === firstParentNodeEdge?.from[0]
		)
		const secondParentNode = flow.nodes.find(
			({ id }) => id === secondParentNodeEdge?.from[0]
		)

		const maybeKey = firstParentNode?.text
		const maybeValue = secondParentNode?.text
		if (!maybeKey || !maybeValue) continue
		const key: unknown = JSON.parse(maybeKey)
		const defaultValue: unknown = JSON.parse(maybeValue)

		if (typeof key !== "string") continue

		if (
			kind === IntervalParameter.kind &&
			isDflowBinanceKlineInterval(defaultValue)
		)
			parameters.push({
				kind,
				key,
				defaultValue
			})

		if (kind === SymbolParameter.kind) {
			if (typeof defaultValue !== "string") continue
			const maybeSymbol = defaultValue
				.split(dflowBinanceSymbolSeparator)
				.join("")

			if (symbols.includes(maybeSymbol))
				parameters.push({
					kind,
					key,
					defaultValue: maybeSymbol
				})
		}
	}
	return parameters
}

// TODO this is implemented with static analysis
// it would need to run the flow with a custom candles node that
// extracts the symbol and interval
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
