import { isNonEmptyString, StrategyFlowGraph } from "@workspace/models"
import { DflowNode } from "dflow"
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
	DflowBinanceSymbolInfo
} from "./symbols.js"

const binanceClientMock = new DflowBinanceClientMock()

export async function extractBinanceParametersFromFlow(
	binanceSymbols: DflowBinanceSymbolInfo[],
	graph: StrategyFlowGraph
) {
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
						) return this.clearOutputs()
						let value = defaultValue
						const inputValue = params[key]
						if (isNonEmptyString(inputValue)) value = inputValue
						this.output(0).data = value
						// Additional code
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
						) return this.clearOutputs()
						let value = defaultValue
						const inputValue = params[key]
						if (isNonEmptyString(inputValue)) value = inputValue
						this.output(0).data = value
						// Additional code
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

export async function extractBinanceSymbolsAndIntervalsFromFlow(
	binanceSymbols: DflowBinanceSymbolInfo[],
	graph: StrategyFlowGraph
): Promise<DflowBinanceSymbolAndInterval[]> {
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
						) return this.clearOutputs()
						// Additional code
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
			({ symbol, interval }, index, array) => index ===
				array.findIndex(
					(element) => element.symbol === symbol &&
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

export async function extractsBinanceSymbolsFromFlow(
	binanceSymbols: DflowBinanceSymbolInfo[],
	graph: StrategyFlowGraph
): Promise<string[]> {
	const symbolsSet = new Set<string>()
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
				[BuyMarket.kind]: class MockedBuyMarket extends DflowNode {
					static kind = BuyMarket.kind
					static inputs = BuyMarket.inputs
					static outputs = BuyMarket.outputs
					run() {
						// 👇 Sync with BuyMarket run()
						const symbol = this.input(0).data
						const quantity = this.input(1).data as
							| number
							| undefined
						const quoteOrderQty = this.input(2).data as
							| number
							| undefined
						const execute = this.input(3).data
						if (
							typeof symbol !== "string" ||
							(quantity === undefined &&
								quoteOrderQty === undefined) ||
							!execute
						) return this.clearOutputs()
						// Additional code
						symbolsSet.add(symbol)
					}
				},
				[SellMarket.kind]: class MockedSellMarket extends DflowNode {
					static kind = SellMarket.kind
					static inputs = SellMarket.inputs
					static outputs = SellMarket.outputs
					run() {
						// 👇 Sync with SellMarket run()
						const symbol = this.input(0).data
						const quantity = this.input(1).data as
							| number
							| undefined
						const quoteOrderQty = this.input(2).data as
							| number
							| undefined
						const execute = this.input(3).data
						if (
							typeof symbol !== "string" ||
							(quantity === undefined &&
								quoteOrderQty === undefined) ||
							!execute
						) return this.clearOutputs()
						// Additional code
						symbolsSet.add(symbol)
					}
				},
				[TickerPrice.kind]: class MockedTickerPrice extends DflowNode {
					static kind = TickerPrice.kind
					static inputs = TickerPrice.inputs
					static outputs = TickerPrice.outputs
					run() {
						// 👇 Sync with TickerPrice run()
						const symbol = this.input(0).data
						if (typeof symbol !== "string") return this.clearOutputs()
						// Additional code
						symbolsSet.add(symbol)
					}
				}
			}
		},
		context
	)

	dflow.load(graph)
	await dflow.run()

	// Return deduplicated and sorted result.
	return Array.from(symbolsSet.values()).sort()
}
