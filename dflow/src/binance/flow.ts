import { isNonEmptyString, StrategyFlowGraph } from "@workspace/models"
import { Dflow, DflowId, DflowNode } from "dflow"
import { now } from "minimal-time-helpers"

import { DflowParameter } from "../common/parameters.js"
import { DflowBinanceContext as Context } from "./context.js"
import { DflowBinanceHost } from "./host.js"
import {
	dflowBinanceKlineIntervals,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { IntervalParameter, SymbolParameter } from "./nodes/parameters.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js"
import {
	DflowBinanceSymbolAndInterval,
	DflowBinanceSymbolInfo,
	dflowBinanceSymbolSeparator
} from "./symbols.js"

const binanceClientMock = new DflowBinanceClientMock()

export const extractBinanceParametersFromFlow = async (
	binanceSymbols: DflowBinanceSymbolInfo[],
	graph: StrategyFlowGraph
) => {
	const parameters: DflowParameter[] = []
	const context: Context = {
		binance: binanceClientMock,
		params: {},
		memory: {},
		time: now()
	}
	const nodesCatalog = getDflowBinanceNodesCatalog(binanceSymbols)

	const dflow = new DflowBinanceHost(
		{
			nodesCatalog: {
				...nodesCatalog,
				[IntervalParameter.kind]: class MockedIntervalParameter extends DflowNode {
					static kind = IntervalParameter.kind
					static inputs = IntervalParameter.inputs
					static outputs = IntervalParameter.outputs
					run() {
						// 👇 Sync with IntervalParameter run()
						const { params } = this.host.context as Context
						const key = this.input(0).data
						const defaultValue = this.input(1).data
						if (
							!isNonEmptyString(key) ||
							!isNonEmptyString(defaultValue)
						)
							return this.clearOutputs()
						let value = defaultValue
						const inputValue = params[key]
						if (isNonEmptyString(inputValue)) value = inputValue
						this.output(0).data = value
						// Set parameter
						parameters.push({
							kind: IntervalParameter.kind,
							key,
							defaultValue
						})
					}
				},
				[SymbolParameter.kind]: class MockedSymbolParameter extends DflowNode {
					static kind = SymbolParameter.kind
					static inputs = SymbolParameter.inputs
					static outputs = SymbolParameter.outputs
					run() {
						// 👇 Sync with SymbolParameter run()
						const { params } = this.host.context as Context
						const key = this.input(0).data
						const defaultValue = this.input(1).data
						if (
							!isNonEmptyString(key) ||
							!isNonEmptyString(defaultValue)
						)
							return this.clearOutputs()
						let value = defaultValue
						const inputValue = params[key]
						if (isNonEmptyString(inputValue)) value = inputValue
						this.output(0).data = value
						// Set parameter
						parameters.push({
							kind: SymbolParameter.kind,
							key,
							defaultValue
						})
					}
				}
			}
		},
		context
	)

	dflow.load(graph)
	await dflow.run()
	return parameters
}

export const extractBinanceSymbolsAndIntervalsFromFlow = async (
	binanceSymbols: DflowBinanceSymbolInfo[],
	graph: StrategyFlowGraph
): Promise<DflowBinanceSymbolAndInterval[]> => {
	const symbolsAndIntervals: DflowBinanceSymbolAndInterval[] = []
	const context: Context = {
		binance: binanceClientMock,
		params: {},
		memory: {},
		time: now()
	}
	const nodesCatalog = getDflowBinanceNodesCatalog(binanceSymbols)

	const dflow = new DflowBinanceHost(
		{
			nodesCatalog: {
				...nodesCatalog,
				[Candles.kind]: class MockedCandle extends DflowNode {
					static kind = Candles.kind
					static inputs = Candles.inputs
					static outputs = Candles.outputs
					run() {
						// 👇 Sync with Candles run()
						const symbol = this.input(0).data as string
						const interval = this.input(1).data as string
						if (
							typeof symbol !== "string" ||
							!isDflowBinanceKlineInterval(interval)
						)
							return this.clearOutputs()
						// Set symbolsAndIntervals
						symbolsAndIntervals.push({
							symbol,
							interval
						})
					}
				}
			}
		},
		context
	)

	dflow.load(graph)
	await dflow.run()
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

export const extractsBinanceSymbolsFromFlow = (
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
